"""Модуль бл для работы с пользователями"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.database import get_session
from .schemes import UserPassword, UserLogin, UserRead
from .service import create_user, authenticate_user, get_access_token, get_current_user
from .service import block_token

auth_router = APIRouter(prefix='/auth')


@auth_router.post('/registration', tags=['auth'])
async def registration(user: UserPassword, session: AsyncSession = Depends(get_session)):
    user_id = await create_user(user, session=session)
    return {'id': user_id}


@auth_router.post("/login", tags=['auth'])
async def login(user_login: UserLogin, session: AsyncSession = Depends(get_session)):
    user = await authenticate_user(user_login.email, user_login.password, session=session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль"
        )
    access_token = get_access_token(user)
    return {"access_token": access_token}


@auth_router.get("/isAuth", tags=['auth'])
async def read_me(token: str = Header(), session: AsyncSession = Depends(get_session)):
    current_user: UserRead = await get_current_user(token, session)
    return {'user_id': current_user.uuid}


@auth_router.delete('/logout', tags=['auth'])
async def logout(token: str = Header(), session: AsyncSession = Depends(get_session)):
    await block_token(token, session)
