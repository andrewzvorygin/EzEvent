import time

from fastapi import Cookie
from jose import jwt
from pydantic import ValidationError

from core.settgings import SECRET_KEY

from . import storage

from .schemes import UserRead, UserPassword, UserLogin, AuthorizationToken, User
from .config import pwd_context, ALGORITHM
from .exception import CREDENTIALS_EXCEPTION, INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION


def verify_password(plain_password, hashed_password):
    """Проверить пароль пользователя"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    """Получить хэшированный пароль"""
    return pwd_context.hash(password)


async def authenticate_user(user_login: UserLogin) -> UserRead:
    """Аутентификация пользователя"""
    user_model = await storage.get_user_by_email(user_login.email)
    try:
        user = UserRead.from_orm(user_model)
    except ValidationError:
        raise INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION
    if not verify_password(user_login.password, user.password):
        raise INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION
    return user


async def get_current_user(access_token: str = Cookie()) -> UserRead:
    """Получить текущего пользователя"""
    try:
        user_record = await storage.get_user(access_token)
        user = UserRead.from_orm(user_record)
    except ValidationError:
        raise CREDENTIALS_EXCEPTION
    return user


async def create_user(user: UserPassword) -> int:
    """Создать пользователя"""
    user.password = get_password_hash(user.password)
    return await storage.create_user(user)


async def get_authorization_token(user: UserRead) -> AuthorizationToken:
    token = _get_token(user)
    authorization_token = AuthorizationToken(user_id=user.user_id, token=token)
    await storage.add_authorization_token(authorization_token)
    return authorization_token


def _get_token(user: User) -> str:
    data_encode = {'sub': user.email, 'time': str(time.time())}
    return jwt.encode(data_encode, SECRET_KEY, algorithm=ALGORITHM)


async def block_access_token(current_user: UserRead):
    await storage.delete_access_token(current_user)
