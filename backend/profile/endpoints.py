from pathlib import Path
from fastapi import APIRouter, Depends

from auth.service import get_current_active_user
from auth.schemes import User, UserRead

from .service import update_profile

profile_router = APIRouter(prefix='/profile')


@profile_router.get('/', response_model=UserRead)
async def get_profile(current_user: UserRead = Depends(get_current_active_user)):
    return current_user


@profile_router.put('/')
async def put_profile(
        new_data: User,
        current_user: UserRead = Depends(get_current_active_user)
):
    await update_profile(new_data, current_user.uuid)


@profile_router.put('/uploadPhoto')
async def upload_photo_profile():
    p = Path('.')
    print(p)
