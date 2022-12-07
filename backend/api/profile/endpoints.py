import os

from fastapi import APIRouter, Depends, UploadFile, status, Response
from fastapi.responses import FileResponse

from api.auth.service import get_current_user
from api.auth.schemes import UserRead

from api.profile import service
from .exceptions import PHOTO_NOT_FOUND

profile_router = APIRouter(prefix='/profile')


@profile_router.put('/', tags=['profile'])
async def put_profile(
        new_data: UserRead,
        response: Response,
        current_user: UserRead = Depends(get_current_user),
):
    await service.update_profile(new_data, current_user)
    response.status_code = status.HTTP_202_ACCEPTED


@profile_router.get('/', tags=['profile'])
async def get_profile(current_user: UserRead = Depends(get_current_user)):
    return current_user


@profile_router.put('/uploadPhoto', tags=['profile'])
async def upload_photo_profile(
        photo: UploadFile,
        response: Response,
        current_user: UserRead = Depends(get_current_user)
):
    await service.save_photo_profile(photo, current_user)
    response.status_code = status.HTTP_202_ACCEPTED


@profile_router.get('/getPhoto', tags=['profile'], response_class=FileResponse)
async def get_photo_profile(path: str):
    if os.path.exists(path):
        return FileResponse(path)
    raise PHOTO_NOT_FOUND
