"""Модуль бл для работы с пользователями"""
from fastapi import APIRouter, Response, Depends

from starlette import status

from schemes import UserCreate, UserLogin, RefreshSession, UserFromToken

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
    authorization_token: RefreshSession = await service.get_authorization_token(user)
    response.set_cookie(
        key='refresh_token',
        value=str(authorization_token.refresh_session),
        httponly=True,
        max_age=authorization_token.expires_in
    )
    return {'access_token': authorization_token.access_token}


@auth_router.get("/isAuth", tags=['auth'])
async def is_auth(current_user: UserFromToken = Depends(service.get_current_user)):
    return {'user_id': current_user.user_id}


@auth_router.delete('/logout', tags=['auth'])
async def logout(
        response: Response, current_user: UserFromToken = Depends(service.get_current_user)
):
    response.delete_cookie('refresh_token')
    return {'access_token': await service.token_logout(current_user)}


@auth_router.put('/refresh_token', tags=['auth'])
async def update_token(
        response: Response,
        authorization_token: RefreshSession = Depends(service.new_refresh_token)
):
    response.set_cookie(
        key='refresh_token',
        value=str(authorization_token.refresh_session),
        httponly=True,
        max_age=authorization_token.expires_in
    )
    return {'access_token': authorization_token.access_token}
