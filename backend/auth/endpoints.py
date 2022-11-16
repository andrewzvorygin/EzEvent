"""Модуль бл для работы с пользователями"""
from fastapi import APIRouter, Depends, Response, Header

from starlette import status

from .schemes import UserPassword, UserLogin, UserRead
from .service import create_user, authenticate_user, get_access_token, get_current_user
from .service import block_token

auth_router = APIRouter(prefix='/auth')


@auth_router.post('/registration', tags=['auth'])
async def registration(user: UserPassword, response: Response):
    user_id = await create_user(user)
    response.status_code = status.HTTP_201_CREATED
    return {'id': user_id}


@auth_router.post("/login", tags=['auth'])
async def login(user_login: UserLogin):
    user = await authenticate_user(user_login)
    access_token = get_access_token(user)
    return access_token


@auth_router.get("/isAuth", tags=['auth'])
async def read_me(current_user: UserRead = Depends(get_current_user)):
    return {'user_id': current_user.uuid}


@auth_router.delete('/logout', tags=['auth'])
async def logout(token: str = Header()):
    await block_token(token)
