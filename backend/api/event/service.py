import string
import secrets
from uuid import UUID

from fastapi import HTTPException
from starlette import status

from api.auth.schemes import UserRead
from . import storage as st

from .schemes import Editor


async def check_responsible(event_uuid: UUID, current_user: UserRead):
    event = await st.get_event(event_uuid)
    if event.responsible_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Действие доступно только ответственному за мероприятие'
        )


async def create_empty_event(current_user: UserRead) -> UUID:
    event_identifier = await st.create_event(current_user)
    editor = Editor(user_id=current_user.user_id, event_id=event_identifier['event_id'])
    await st.add_editor(editor)
    return event_identifier['uuid_edit']


async def get_key_invite(event_uuid) -> str:
    key = await st.get_key_invite(event_uuid)
    if key:
        return key
    new_key = await update_key_invite(event_uuid=event_uuid)
    return new_key


async def update_key_invite(event_uuid: UUID) -> str:
    new_key = generate_key_invite()
    await st.update_key_invite(event_uuid, new_key)
    return new_key


def generate_key_invite() -> str:
    alphabet = string.ascii_letters + string.digits
    key_invite = ''.join(secrets.choice(alphabet) for _ in range(8))
    return key_invite


async def add_editor(event_uuid, user_id):
    event = await st.get_event(event_uuid)
    editor = Editor(user_id=user_id, event_id=event.event_id)
    await st.add_editor(editor)


async def add_editor_by_key(event_uuid: UUID, key: str, current_user: UserRead):
    event = await st.get_event(event_uuid=event_uuid)
    if event.key_invite == key:
        await add_editor(user_id=current_user.user_id, event_uuid=event_uuid)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Не верный ключ')
