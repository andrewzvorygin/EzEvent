import time

from jose import jwt

from src.application.core import settings
from .config import pwd_context, ALGORITHM
from schemes.userbase import UserBase


def verify_password(plain_password, hashed_password):
    """Проверить пароль пользователя"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    """Получить хэшированный пароль"""
    return pwd_context.hash(password)


def get_token(user: UserBase) -> str:
    data_encode = {'sub': user.email, 'time': str(time.time())}
    return jwt.encode(data_encode, settings.app.SECRET_KEY, algorithm=ALGORITHM)
