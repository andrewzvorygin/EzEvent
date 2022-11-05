from datetime import timedelta, datetime

from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError
from starlette import status

from core import DEFAULT_PROFILE_PHOTO
from core.database import database
from core.settgings import SECRET_KEY

from .models import users, black_list_token
from .schemes import UserRead, TokenData, UserPassword
from .config import pwd_context, ALGORITHM


async def get_user(email):
    """Получить пользователя по email"""
    smtp = users.select().where(users.c.email == email)
    user = await database.fetch_one(smtp)
    return dict(user) if user else None


def verify_password(plain_password, hashed_password):
    """Проверить пароль пользователя"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Получить хэшированный пароль"""
    return pwd_context.hash(password)


async def authenticate_user(email: str, password: str):
    """Аутентификация пользователя"""
    user_dict = await get_user(email)
    user = UserPassword(**user_dict)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta):
    """Создать токен доступа"""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Header()):
    """Получить текущего пользователя"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if await is_token_blacklisted(token):
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user_dict = await get_user(token_data.username)
    user = UserRead(**user_dict)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: UserRead = Depends(get_current_user)):
    """Получить активного пользователя"""
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def create_user(user: UserPassword):
    """Создать пользователя"""
    user.password = get_password_hash(user.password)
    new_user = users.insert().values(**user.dict(), photo=DEFAULT_PROFILE_PHOTO)
    pk = await database.execute(new_user)
    return pk


async def is_token_blacklisted(token: str = Header()):
    """Занесён ли токен в чёрный список"""
    smtp = black_list_token.select().where(black_list_token.c.token == token)
    inactive_token = await database.fetch_one(smtp)
    return bool(inactive_token)


async def block_token(token: str = Header()):
    """Заблокировать токен"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        time_token = datetime.fromtimestamp(payload.get('exp'))
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    smtp = black_list_token.insert().values(token=token, lifetime=time_token)
    await database.execute(smtp)
