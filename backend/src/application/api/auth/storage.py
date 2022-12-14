from uuid import UUID

from databases.interfaces import Record
from sqlalchemy import select, insert, delete

from src.application.core import database, DEFAULT_PROFILE_PHOTO
from models import user_orm, refresh_session_orm

from . import exception
import schemes as sh


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


async def add_refresh_session(refresh_session: sh.RefreshSession) -> None:
    smtp = (
        insert(refresh_session_orm)
        .values(
            user_id=refresh_session.user_id,
            refresh_session=refresh_session.refresh_session,
            expires_in=refresh_session.expires_in,
            time_created=refresh_session.time_created
        )
    )
    await database.execute(smtp)


async def get_refresh_session(refresh_token: UUID) -> sh.RefreshSession:
    smtp = (
        select(refresh_session_orm)
        .where(refresh_session_orm.c.refresh_session == refresh_token)
    )
    result = await database.fetch_one(smtp)
    return sh.RefreshSession.from_orm(result)


async def delete_refresh_session(refresh_token: UUID) -> None:
    smtp = (
        delete(refresh_session_orm)
        .where(refresh_session_orm.c.refresh_session == refresh_token)
    )
    await database.execute(smtp)


async def get_user(user_id: int) -> Record:
    smtp = select(user_orm).where(user_orm.c.user_id == user_id)
    result = await database.fetch_one(smtp)
    return result
