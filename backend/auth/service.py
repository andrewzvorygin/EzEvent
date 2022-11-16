from datetime import timedelta, datetime

from fastapi import Header
from jose import jwt, JWTError
from pydantic import ValidationError

from sqlalchemy import select, insert

from core import DEFAULT_PROFILE_PHOTO, database
from core.settgings import SECRET_KEY

from .models import user_table, black_list_token
from .schemes import UserRead, UserPassword, UserLogin, Token
from .config import pwd_context, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from .exception import CREDENTIALS_EXCEPTION, INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION, EMAIL_ALREADY_REGISTERED_EXCEPTION


def verify_password(plain_password, hashed_password):
    """Проверить пароль пользователя"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Получить хэшированный пароль"""
    return pwd_context.hash(password)


async def get_user(email: str):
    """Получить пользователя по email"""
    smtp = get_user_template(email)
    return await database.fetch_one(smtp)


def get_user_template(email):
    return user_table.select().where(user_table.c.email == email)


async def authenticate_user(user_login: UserLogin):
    """Аутентификация пользователя"""
    user_orm = await get_user(user_login.email)
    try:
        user = UserPassword.from_orm(user_orm)
    except ValidationError:
        raise INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION
    if not verify_password(user_login.password, user.password):
        raise INCORRECT_LOGIN_OR_PASSWORD_EXCEPTION
    return user


async def get_current_user(token: str = Header()):
    """Получить текущего пользователя"""
    if await is_token_blacklisted(token):
        raise CREDENTIALS_EXCEPTION
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise CREDENTIALS_EXCEPTION
    except JWTError:
        raise CREDENTIALS_EXCEPTION

    user_orm = await get_user(email)
    try:
        user = UserRead.from_orm(user_orm)
    except ValidationError:
        raise CREDENTIALS_EXCEPTION
    return user


async def create_user(user: UserPassword):
    """Создать пользователя"""
    user.password = get_password_hash(user.password)
    return await _create_user(user)


async def _create_user(user: UserPassword):
    """Создать пользователя"""
    template = create_user_template(user)
    try:
        result = await database.execute(template)
    except Exception:
        raise EMAIL_ALREADY_REGISTERED_EXCEPTION
    return result


def create_user_template(user: UserPassword):
    """Создать пользователя в базе данных"""
    return user_table.insert().values(**user.dict(), photo=DEFAULT_PROFILE_PHOTO)


def create_access_token(data: dict, expires_delta: timedelta):
    """Создать токен доступа"""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_access_token(user: UserPassword):
    """Получить токен доступа"""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token)


async def is_token_blacklisted(token: str = Header()):
    """Занесён ли токен в чёрный список"""
    smtp = get_token_template(token)
    result = await database.fetch_one(smtp)
    return bool(result)


def get_token_template(token: str):
    return select(black_list_token).where(black_list_token.c.token == token)


async def block_token(token: str):
    """Заблокировать токен"""
    await get_current_user(token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        time_token = datetime.fromtimestamp(payload.get('exp'))
    except JWTError:
        raise CREDENTIALS_EXCEPTION
    block_token_template = write_token_in_black_list_template(token, time_token)
    await database.execute(block_token_template)


def write_token_in_black_list_template(token, time_token):
    return insert(black_list_token).values(token=token, lifetime=time_token)
