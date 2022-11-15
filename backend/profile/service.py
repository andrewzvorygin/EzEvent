import os
from uuid import UUID, uuid1

import aiofiles

from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from auth.schemes import User, UserRead, UserUpdate
from auth.models import users

from core import PHOTO_PROFILE_PATH


PHOTO_NOT_FOUND_EXCEPTION = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Фотография не найдена",
    )


async def update_profile_template(update_data: User, id_: UUID):
    return users.update().where(users.c.uuid == str(id_)).values(**update_data.dict())


async def update_profile(update_data: UserUpdate, id_: UUID, session: AsyncSession):
    """Обновить данные профиля"""
    smtp = await update_profile_template(update_data=update_data, id_=id_)
    await session.execute(smtp)
    await session.commit()


async def save_photo_profile(photo: UploadFile, current_user: UserRead, session: AsyncSession):
    """Сохранить фото профиля"""
    extension = get_extension(photo.filename)

    if not extension:
        raise ValueError('Невалидный файл')

    file_id = uuid1()
    path_to_photo = os.path.join(PHOTO_PROFILE_PATH, f'{file_id}.{extension}')

    async with aiofiles.open(path_to_photo, 'wb') as file:
        data = await photo.read()
        await file.write(data)

    await save_photo_profile_db(path_to_photo, current_user.uuid, session)

    if current_user.photo and os.path.isfile(current_user.photo):
        os.remove(current_user.photo)


async def save_photo_profile_db(path_to_photo, current_user_id, session: AsyncSession):
    """Обновить фото пользователя в базе"""
    smtp = save_photo_profile_template(current_user_id, path_to_photo)
    await session.execute(smtp)


def save_photo_profile_template(current_user_id, path_to_photo):
    return users.update().where(users.c.uuid == current_user_id).values(photo=path_to_photo)


def get_extension(filename: str):
    index = filename.find('.')
    extension = filename[index + 1:].lower()
    if extension in {'jpg', 'jpeg', 'bmp', 'png'}:
        return extension
    return None
