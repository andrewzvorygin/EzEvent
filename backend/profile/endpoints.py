import os

from fastapi import APIRouter, Depends, UploadFile, status, Header, Response
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from auth.service import get_current_user
from auth.schemes import UserRead, UserUpdate
from core.database import get_session

from .service import update_profile, save_photo_profile
from .service import PHOTO_NOT_FOUND_EXCEPTION

profile_router = APIRouter(prefix='/profile')


@profile_router.put('/', tags=['profile'])
async def put_profile(
        new_data: UserUpdate,
        response: Response,
        token: str = Header(),
        session: AsyncSession = Depends(get_session),
):
    current_user = await get_current_user(token, session)
    await update_profile(new_data, current_user.uuid, session)
    response.status_code = status.HTTP_202_ACCEPTED


@profile_router.get('/', response_model=UserRead, tags=['profile'])
async def get_profile(token: str = Header(), session: AsyncSession = Depends(get_session)):
    current_user = await get_current_user(token, session)
    return current_user


@profile_router.put('/uploadPhoto', tags=['profile'])
async def upload_photo_profile(
        photo: UploadFile,
        response: Response,
        token: str = Header(),
        session: AsyncSession = Depends(get_session)
):
    current_user: UserRead = await get_current_user(token, session)
    await save_photo_profile(photo, current_user, session)
    response.status_code = status.HTTP_202_ACCEPTED


@profile_router.get('/getPhoto', tags=['profile'], response_class=FileResponse)
async def get_photo_profile(path: str):
    if os.path.exists(path):
        return FileResponse(path)
    raise PHOTO_NOT_FOUND_EXCEPTION()
