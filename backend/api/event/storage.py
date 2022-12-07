from uuid import UUID

from databases.interfaces import Record
from sqlalchemy import select, insert, update

from api.auth.schemes import UserRead
from core import database
from .models import event_orm, editor_orm
from .schemes import EventRead, Editor


async def get_event(event_uuid: UUID) -> EventRead:
    smtp = select(event_orm).where(event_orm.c.uuid_edit == event_uuid)
    result = await database.fetch_one(smtp)
    return EventRead.from_orm(result)


async def add_editor(editor: Editor) -> None:
    smtp = insert(editor_orm).values(event_id=editor.event_id, user_id=editor.user_id)
    await database.execute(smtp)


async def update_key_invite(event_uuid: UUID, new_key: str) -> None:
    smtp_update_key_invite = (
        update(event_orm)
        .where(event_orm.c.uuid_edit == event_uuid)
        .values(key_invite=new_key)
    )
    await database.execute(smtp_update_key_invite)


async def create_event(current_user: UserRead) -> Record:
    smtp = (
        insert(event_orm)
        .values(responsible_id=current_user.user_id)
        .returning(event_orm.c.uuid_edit, event_orm.c.event_id)
    )
    return await database.fetch_one(smtp)


async def get_key_invite(event_uuid: UUID) -> str:
    smtp = select(event_orm.c.key_invite).where(event_orm.c.uuid_edit == event_uuid)
    key = await database.fetch_val(smtp)
    return key
