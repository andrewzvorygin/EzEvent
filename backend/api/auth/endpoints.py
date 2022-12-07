"""Модуль бл для работы с пользователями"""
from fastapi import APIRouter, Response, Depends

from starlette import status

from .schemes import UserPassword, UserLogin, UserRead

from . import service

auth_router = APIRouter(prefix='/auth')


@auth_router.post('/registration', tags=['auth'])
async def registration(user: UserPassword, response: Response):
    user_id = await service.create_user(user)
    response.status_code = status.HTTP_201_CREATED
    return {'id': user_id}


@auth_router.post("/login", tags=['auth'])
async def login(user_login: UserLogin, response: Response):
    user = await service.authenticate_user(user_login)
    authorization_token = await service.get_authorization_token(user)
    response.set_cookie(key='access_token', value=authorization_token.token)
    response.status_code = status.HTTP_200_OK


@auth_router.get("/isAuth", tags=['auth'])
async def read_me(current_user: UserRead = Depends(service.get_current_user)):
    return {'user_id': current_user.uuid}


@auth_router.delete('/logout', tags=['auth'])
async def logout(current_user: UserRead = Depends(service.get_current_user)):
    await service.block_access_token(current_user)
