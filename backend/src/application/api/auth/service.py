from datetime import timedelta, datetime
from uuid import UUID, uuid4

from fastapi import Header, Cookie
from jose import jwt, JWTError
from pydantic import ValidationError

from src.application.core import settings

import schemes as sch

from . import storage, utils
from . import exception as exc
from . import config


async def create_user(user: sch.UserCreate) -> int:
    """Создать пользователя"""
    user.password = utils.get_password_hash(user.password)
    return await storage.create_user(user)


async def authenticate_user(user_login: sch.UserLogin) -> sch.UserRead:
    """Аутентификация пользователя"""
    user_model = await storage.get_user_by_email(user_login.email)
    try:
        user = sch.UserRead.from_orm(user_model)
    except ValidationError:
        raise exc.INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION
    if not utils.verify_password(user_login.password, user.password):
        raise exc.INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION
    return user


async def get_current_user(access_token: str = Header()) -> sch.UserFromToken:
    """Получить текущего пользователя"""
    try:
        payload = jwt.decode(access_token, settings.app.SECRET_KEY_SOLT, algorithms=[config.ALGORITHM])
        user = sch.UserFromToken(**payload)
    except JWTError:
        raise exc.CREDENTIALS_EXCEPTION
    except ValidationError:
        raise exc.CREDENTIALS_EXCEPTION
    return user


def create_token(data: dict, expires_delta: timedelta) -> str:
    """Создать токен"""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.app.SECRET_KEY_SOLT, algorithm=config.ALGORITHM)
    return encoded_jwt


async def get_authorization_token(user: sch.UserRead) -> sch.RefreshSession:
    """Получить токен авторизации"""
    access_token = await get_access_token(user)
    refresh_session = sch.RefreshSession(
        user_id=user.user_id,
        access_token=access_token,
        expires_in=config.REFRESH_TOKEN_EXPIRE_MINUTES,
        time_created=datetime.utcnow()
    )

    await storage.add_refresh_session(refresh_session)
    return refresh_session


async def get_access_token(user: sch.UserRead) -> str:
    return await get_token(user, config.ACCESS_TOKEN_EXPIRE_MINUTES)


async def get_token(user: sch.UserRead, time_expires: int) -> str:
    token_expires = timedelta(minutes=time_expires)
    data_to_token = dict(
        user_id=user.user_id, email=user.email, uuid=str(user.uuid), is_admin=user.is_admin
    )
    token = create_token(
        data=data_to_token, expires_delta=token_expires
    )
    return token


async def token_logout(current_user: sch.UserFromToken) -> str:
    current_user.in_system = False
    data = current_user.dict(exclude={'refresh_session'})
    data['uuid'] = str(data['uuid'])
    token = create_token(data, timedelta(0))
    return token


async def new_refresh_token(refresh_token: UUID = Cookie()):
    try:
        refresh_session = await storage.get_refresh_session(refresh_token)
    except ValidationError:
        raise exc.CREDENTIALS_EXCEPTION

    await storage.delete_refresh_session(refresh_session.refresh_session)
    token_expire = refresh_session.time_created + timedelta(refresh_session.expires_in)
    if token_expire.timestamp() < datetime.now().timestamp():
        raise exc.CREDENTIALS_EXCEPTION

    record = await storage.get_user(refresh_session.user_id)
    user = sch.UserRead.from_orm(record)
    refresh_session.refresh_session = uuid4()
    refresh_session.access_token = await get_access_token(user)
    await storage.add_refresh_session(refresh_session)
    return refresh_session
