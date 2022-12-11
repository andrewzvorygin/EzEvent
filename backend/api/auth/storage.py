from databases.interfaces import Record
from sqlalchemy import select, insert, delete
from sqlalchemy.orm import join

from core import database, DEFAULT_PROFILE_PHOTO
from .models import user_orm, authorization_token_orm

from . import schemes as sh, exception


async def get_user_by_email(email: str) -> Record:
    smtp = (
        select(user_orm).where(user_orm.c.email == email)
    )
    return await database.fetch_one(smtp)


async def create_user(user: sh.UserCreate) -> int:
    """Создать пользователя"""
    template = user_orm.insert().values(**user.dict(), photo=DEFAULT_PROFILE_PHOTO)
    try:
        id_new_user = await database.execute(template)
    except Exception:
        raise exception.EMAIL_ALREADY_REGISTERED_EXCEPTION
    return id_new_user


async def add_authorization_token(authorization_token: sh.AuthorizationToken) -> None:
    smtp = (
        insert(authorization_token_orm)
        .values(
            user_id=authorization_token.user_id,
            token=authorization_token.token
        )
    )
    await database.execute(smtp)


async def get_user(token: str) -> Record:
    smtp = (
        select(user_orm)
        .select_from(
            join(
                authorization_token_orm, user_orm
            )
        )
        .where(authorization_token_orm.c.token == token)
    )
    return await database.fetch_one(smtp)


async def delete_access_token(user: sh.UserRead) -> None:
    smtp = (
        delete(authorization_token_orm)
        .where(authorization_token_orm.c.user_id == user.user_id)
    )
    await database.execute(smtp)
