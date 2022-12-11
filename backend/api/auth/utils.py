import time

from jose import jwt

from core import settings
from .config import pwd_context, ALGORITHM
from .schemes import User


def verify_password(plain_password, hashed_password):
    """Проверить пароль пользователя"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    """Получить хэшированный пароль"""
    return pwd_context.hash(password)


def get_token(user: User) -> str:
    data_encode = {'sub': user.email, 'time': str(time.time())}
    return jwt.encode(data_encode, settings.app.secret_key, algorithm=ALGORITHM)
