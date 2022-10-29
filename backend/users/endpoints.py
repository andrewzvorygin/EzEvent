"""Модуль бл для работы с пользователями"""
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Header
from starlette import status

from .schemes import User, Token, UserPassword, UserLogin, UserRead
from .service import ACCESS_TOKEN_EXPIRE_MINUTES
from .service import create_user, authenticate_user, get_current_active_user, create_access_token
from .service import block_token

users_router = APIRouter(prefix='/auth')


@users_router.post('/registration')
async def registration(user: UserPassword):
    return await create_user(user)


@users_router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    user = await authenticate_user(user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@users_router.get("/isAuth/", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@users_router.delete('/logout')
async def logout(token: str = Header()):
    await block_token(token)
