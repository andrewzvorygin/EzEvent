"""Модуль бл для работы с пользователями"""
from fastapi import APIRouter, Response, Depends, Cookie

from starlette import status

from .schemes import UserCreate, UserLogin, UserRead

from . import service

auth_router = APIRouter(prefix='/auth')


@auth_router.post('/registration', tags=['auth'])
async def registration(user: UserCreate, response: Response):
    user_id = await service.create_user(user)
    response.status_code = status.HTTP_201_CREATED
    return {'id': user_id}


@auth_router.post("/login", tags=['auth'])
async def login(user_login: UserLogin, response: Response):
    user = await service.authenticate_user(user_login)
    authorization_token = await service.get_authorization_token(user)
    response.set_cookie(key='access_token', value=authorization_token.token, httponly=True)
    response.status_code = status.HTTP_200_OK


@auth_router.get("/isAuth", tags=['auth'])
async def read_me(
        access_token: str | None = Cookie(default=None),
        response: Response = None
):
    await service.set_csrf_token_into_cookie_response(response)
    if access_token is None:
        return {'user_id': None}
    current_user: UserRead = await service.get_current_user(access_token)
    return {'user_id': current_user.user_id}


@auth_router.delete('/logout', tags=['auth'])
async def logout(
        response: Response, current_user: UserRead = Depends(service.get_current_user)
):
    response.delete_cookie('access_token')
    await service.block_access_token(current_user)
