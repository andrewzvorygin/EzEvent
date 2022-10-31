from fastapi import APIRouter, Depends, UploadFile, status

from auth.service import get_current_active_user
from auth.schemes import User, UserRead

from .service import update_profile, save_photo_profile

profile_router = APIRouter(prefix='/profile')


@profile_router.get('/', response_model=UserRead, tags=['profile'])
async def get_profile(current_user: UserRead = Depends(get_current_active_user)):
    return current_user


@profile_router.put('/', tags=['profile'])
async def put_profile(
        new_data: User,
        current_user: UserRead = Depends(get_current_active_user)
):
    await update_profile(new_data, current_user.uuid)


@profile_router.put('/uploadPhoto', tags=['profile'])
async def upload_photo_profile(photo: UploadFile):
    await save_photo_profile(photo)
    return {'status': status.HTTP_200_OK}
