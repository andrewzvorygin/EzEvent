from datetime import timedelta, datetime

from fastapi import HTTPException
from jose import jwt, JWTError

from sqlalchemy import select
from sqlalchemy.engine import CursorResult
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core import DEFAULT_PROFILE_PHOTO
from core.settgings import SECRET_KEY

from .models import users, black_list_token, BlackListToken
from .schemes import UserRead, UserPassword
from .config import pwd_context, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

CREDENTIALS_EXCEPTION = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Невалидный токен",
    )


def verify_password(plain_password, hashed_password):
    """Проверить пароль пользователя"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Получить хэшированный пароль"""
    return pwd_context.hash(password)


async def get_user(email, session: AsyncSession):
    """Получить пользователя по email"""
    smtp = get_user_template(email)
    result: CursorResult = await session.execute(smtp)
    user = result.first()
    return dict(user) if user else None


def get_user_template(email):
    return users.select().where(users.c.email == email)


async def authenticate_user(email: str, password: str, session: AsyncSession):
    """Аутентификация пользователя"""
    user_dict = await get_user(email, session)
    if not user_dict:
        return False
    user = UserPassword(**user_dict)
    if not verify_password(password, user.password):
        return False
    return user


async def get_current_user(token: str, session: AsyncSession):
    """Получить текущего пользователя"""
    if await is_token_blacklisted(token, session):
        raise CREDENTIALS_EXCEPTION
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise CREDENTIALS_EXCEPTION
    except JWTError:
        raise CREDENTIALS_EXCEPTION

    user_dict = await get_user(email, session=session)
    user = UserRead(**user_dict)
    if user is None:
        raise CREDENTIALS_EXCEPTION
    return user


async def create_user(user: UserPassword, session: AsyncSession):
    """Создать пользователя"""
    user.password = get_password_hash(user.password)
    return await _create_user(user, session)


async def _create_user(user: UserPassword, session: AsyncSession):
    """Создать пользователя"""
    template = create_user_template(user)
    try:
        result = await session.execute(template)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Такой пользователь уже существует'
        )
    return result.inserted_primary_key[0]


def create_user_template(user: UserPassword):
    """Создать пользователя в базе данных"""
    return users.insert().values(**user.dict(), photo=DEFAULT_PROFILE_PHOTO)


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
    return access_token


async def is_token_blacklisted(token: str, session: AsyncSession):
    """Занесён ли токен в чёрный список"""
    smtp = get_token_template(token)
    result = await session.execute(smtp)
    inactive_token = result.scalars().first()
    return bool(inactive_token)


def get_token_template(token: str):
    return select(black_list_token).where(black_list_token.c.token == token)


async def block_token(token: str, session: AsyncSession):
    """Заблокировать токен"""
    await get_current_user(token, session)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        time_token = datetime.fromtimestamp(payload.get('exp'))
    except JWTError:
        raise CREDENTIALS_EXCEPTION
    bad_token = BlackListToken(token=token, lifetime=time_token)
    session.add(bad_token)
