import os
from uuid import UUID, uuid1

import aiofiles

from fastapi import UploadFile

from auth.schemes import User, UserRead
from auth.models import users

from core import STATIC_FILE
from core.database import database


async def update_profile(update_data: User, id_: UUID):
    """Обновить данные профиля"""
    smtp = (
        users
            .update()
            .where(users.c.uuid == id_)
            .values(**update_data.dict())
    )
    await database.execute(smtp)


async def save_photo_profile(photo: UploadFile, current_user: UserRead):
    """Сохранить фото профиля"""
    extension = get_extension(photo.filename)

    if not extension:
        raise ValueError('Невалидный файл')

    file_id = uuid1()
    path_to_photo = os.path.join(STATIC_FILE, 'profile_photo', f'{file_id}.{extension}')

    async with aiofiles.open(path_to_photo, 'wb') as file:
        data = await photo.read()
        await file.write(data)

    await save_photo_profile_db(path_to_photo, current_user.uuid)

    if current_user.photo and os.path.isfile(current_user.photo):
        os.remove(current_user.photo)


async def save_photo_profile_db(path_to_photo, current_user_id):
    """Обновить фото пользователя в базе"""
    smtp = (
        users
            .update()
            .where(users.c.uuid == current_user_id)
            .values(photo=path_to_photo)
    )
    await database.execute(smtp)


def get_extension(filename: str):
    index = filename.find('.')
    extension = filename[index + 1:].lower()
    if extension in {'jpg', 'jpeg', 'bmp', 'png'}:
        return extension
    return None
