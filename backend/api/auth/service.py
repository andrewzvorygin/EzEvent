from fastapi import Cookie, Response
from fastapi_csrf_protect import CsrfProtect
from pydantic import ValidationError

from . import storage, utils
from . import exception as exc
from . import schemes as sch


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


async def get_current_user(access_token: str = Cookie()) -> sch.UserRead:
    """Получить текущего пользователя"""
    try:
        user_record = await storage.get_user(access_token)
        user = sch.UserRead.from_orm(user_record)
    except ValidationError:
        raise exc.CREDENTIALS_EXCEPTION
    return user


async def create_user(user: sch.UserPassword) -> int:
    """Создать пользователя"""
    user.password = utils.get_password_hash(user.password)
    return await storage.create_user(user)


async def get_authorization_token(user: sch.UserRead) -> sch.AuthorizationToken:
    token = utils.get_token(user)
    authorization_token = sch.AuthorizationToken(user_id=user.user_id, token=token)
    await storage.add_authorization_token(authorization_token)
    return authorization_token


async def block_access_token(current_user: sch.UserRead):
    await storage.delete_access_token(current_user)


async def set_csrf_token_into_cookie_response(response: Response):
    csrf_protect = CsrfProtect()
    csrf_token = csrf_protect.generate_csrf()
    response.set_cookie(key='X-CSRF-Token', value=csrf_token)
