import os
from uuid import UUID, uuid1

import aiofiles

from fastapi import UploadFile, HTTPException
from starlette import status

from auth.schemes import User, UserRead, UserUpdate
from auth.models import user_table

from core import PHOTO_PROFILE_PATH, database


PHOTO_NOT_FOUND = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Фотография не найдена",
    )

INVALID_FILE = HTTPException(
    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    detail='Невалидный файл'
)


async def update_profile_template(update_data: User, id_: UUID):
    return user_table.update().where(user_table.c.uuid == str(id_)).values(**update_data.dict())


async def update_profile(update_data: UserUpdate, id_: UUID):
    """Обновить данные профиля"""
    smtp = await update_profile_template(update_data=update_data, id_=id_)
    await database.execute(smtp)


async def save_photo_profile(photo: UploadFile, current_user: UserRead):
    """Сохранить фото профиля"""
    extension = get_extension(photo.filename)
    if not extension:
        raise INVALID_FILE
    path_to_photo = await get_path_to_file(extension)
    await save_file(path_to_photo, photo)
    await save_photo_profile_db(path_to_photo, current_user.uuid)
    await delete_last_photo(current_user)


async def delete_last_photo(current_user):
    """Удалить последнее загруженное фото, чтобы не хранить неиспользуемые фото"""
    if current_user.photo and os.path.isfile(current_user.photo):
        os.remove(current_user.photo)


async def save_file(path_to_photo, photo):
    """Сохранить файл в системе"""
    async with aiofiles.open(path_to_photo, 'wb') as file:
        data = await photo.read()
        await file.write(data)


async def get_path_to_file(extension):
    """Получить сгенерированный путь до файла"""
    file_id = uuid1()
    path_to_photo = os.path.join(PHOTO_PROFILE_PATH, f'{file_id}.{extension}')
    return path_to_photo


async def save_photo_profile_db(path_to_photo, current_user_id):
    """Обновить фото пользователя в базе"""
    smtp = save_photo_profile_template(current_user_id, path_to_photo)
    await database.execute(smtp)


def save_photo_profile_template(current_user_id, path_to_photo):
    return user_table.update().where(user_table.c.uuid == current_user_id).values(photo=path_to_photo)


def get_extension(filename: str):
    index = filename.find('.')
    extension = filename[index + 1:].lower()
    if extension in {'jpg', 'jpeg', 'bmp', 'png'}:
        return extension
    return None
