import string
import secrets
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select, update, insert
from starlette import status

from core.database import database
from auth.schemes import UserRead

from .models import event_orm, editor_orm
from .schemes import Editor, EventRead


async def check_responsible(event_uuid: UUID, current_user: UserRead):
    responsible = await get_responsible(event_uuid)
    if responsible != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Действие доступно только ответственному за мероприятие'
        )


async def create_empty_event(current_user: UserRead):
    smtp_create_empty = create_empty_event_template(current_user)
    event_identifier = await database.fetch_one(smtp_create_empty)
    editor = Editor(user_id=current_user.user_id, event_id=event_identifier['event_id'])
    await add_editor_db(editor)
    return event_identifier['uuid_edit']


def create_empty_event_template(current_user):
    return (
        insert(event_orm)
        .values(responsible_id=current_user.user_id)
        .returning(event_orm.c.uuid_edit, event_orm.c.event_id)
    )


async def get_key_invite(event_uuid):
    """Получить ключ-приглашение или сгенерировать новый, если его нет"""
    smtp = select(event_orm.c.key_invite).where(event_orm.c.uuid_edit == event_uuid)
    key = await database.fetch_val(smtp)
    if key:
        return key
    new_key = await update_key_invite(event_uuid=event_uuid)
    return new_key


async def update_key_invite(event_uuid):
    """Получить новый ключ и обновить его в бд"""
    new_key = generate_key_invite()
    smtp_update_key_invite = update_key_invite_template(event_uuid, new_key)
    await database.execute(smtp_update_key_invite)
    return new_key


async def update_key_invite_db(event_uuid, new_key):
    smtp_update_key_invite = update_key_invite_template(event_uuid, new_key)
    await database.execute(smtp_update_key_invite)


def update_key_invite_template(event_uuid, new_key):
    """Запрос на обновления ключа-приглашения"""
    return (
        update(event_orm)
        .where(event_orm.c.uuid_edit == event_uuid)
        .values(key_invite=new_key)
    )


def generate_key_invite():
    """Сгенерировать ключ-приглашение"""
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(8))
    return password


async def get_responsible(event_uuid):
    event = await get_event_by_uuid(event_uuid)
    return event.responsible_id


async def add_editor(event_uuid, user_id):
    event = await get_event_by_uuid(event_uuid)
    editor = Editor(user_id=user_id, event_id=event.event_id)
    await add_editor_db(editor)


async def add_editor_db(editor: Editor):
    smtp = insert(editor_orm).values(event_id=editor.event_id, user_id=editor.user_id)
    await database.execute(smtp)


async def get_event_by_uuid(event_uuid) -> EventRead:
    smtp = select(event_orm).where(event_orm.c.uuid_edit == event_uuid)
    result = await database.fetch_one(smtp)
    return EventRead.from_orm(result)


async def add_editor_by_key(event_uuid: UUID, key: str, current_user: UserRead):
    event = await get_event_by_uuid(event_uuid=event_uuid)
    if event.key_invite == key:
        await add_editor(user_id=current_user.user_id, event_uuid=event_uuid)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Не верный ключ')
