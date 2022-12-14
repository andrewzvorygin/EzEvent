import os
from uuid import uuid1

import aiofiles

from fastapi import UploadFile

import schemes as sh

from src.application.core import PHOTO_PROFILE_PATH
from .exceptions import INVALID_FILE

from api.profile import storage


async def update_profile(update_data: sh.UserBase, current_user: sh.UserFromToken):
    await storage.update_profile(update_data, current_user)


async def save_photo_profile(photo: UploadFile, current_user: sh.UserFromToken):
    """Сохранить фото профиля"""
    extension = get_extension(photo.filename)
    if not extension:
        raise INVALID_FILE
    path_to_photo = await get_path_to_file(extension)
    await save_file(path_to_photo, photo)
    await storage.save_photo_profile(path_to_photo, current_user.uuid)


async def save_file(path_to_photo: str, photo: UploadFile):
    """Сохранить файл в системе"""
    async with aiofiles.open(path_to_photo, 'wb') as file:
        data = await photo.read()
        await file.write(data)


async def get_path_to_file(extension: str) -> str:
    """Получить сгенерированный путь до файла"""
    file_id = uuid1()
    path_to_photo = os.path.join(PHOTO_PROFILE_PATH, f'{file_id}.{extension}')
    return path_to_photo


def get_extension(filename: str) -> str:
    index = filename.find('.')
    extension = filename[index + 1:].lower()
    if extension not in {'jpg', 'jpeg', 'bmp', 'png'}:
        raise INVALID_FILE
    return extension
