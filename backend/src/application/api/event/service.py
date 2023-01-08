import string
import secrets
from datetime import datetime
from uuid import UUID

from fastapi import HTTPException
from starlette import status

from schemes import UserFromToken, UserRead, Participant
from schemes.event import Navigation
from . import storage as st


async def check_responsible(event_uuid: UUID, current_user: UserFromToken):
    event = await st.get_event_for_editor(event_uuid)
    if event.responsible_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Действие доступно только ответственному за мероприятие'
        )


# async def check_editor(event_uuid: UUID, current_user: UserFromToken):


async def create_empty_event(current_user: UserFromToken) -> UUID:
    event_identifier = await st.create_event(current_user)
    editor = Participant(user_id=current_user.user_id, event_id=event_identifier['event_id'])
    await st.add_participant(editor)
    return event_identifier['uuid_edit']


async def get_event_registry(
        date_start: datetime,
        date_end: datetime,
        navigation: Navigation,
        type_user: int,
        current_user: UserFromToken
):
    """asdas"""
    events_id = await st.get_events_keys(current_user.user_id, type_user)
    events = await st.get_events(date_start, date_end, events_id, navigation)
    return events


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


async def add_editor(event_uuid: UUID, user_id: int):
    await add_participant(event_uuid, user_id, True)


async def add_editor_by_key(event_uuid: UUID, key: str, current_user: UserFromToken):
    event = await st.get_event_for_editor(event_uuid=event_uuid)
    if event.key_invite == key:
        await add_editor(user_id=current_user.user_id, event_uuid=event_uuid)
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Не верный ключ')


async def search_users_by_email(email_prefix: str) -> list[UserRead]:
    return await st.get_users_by_email(email_prefix)


async def add_visitor(event_uuid: UUID, current_user: UserFromToken):
    await add_participant(event_uuid, current_user.user_id, False)


async def add_participant(event_uuid: UUID, user_id: int, is_editor: bool):
    if is_editor:
        event = await st.get_event_for_editor(event_uuid)
    else:
        event = await st.get_event_for_visitor(event_uuid)
    participant = Participant(user_id=user_id, event_id=event.event_id, is_editor=is_editor)
    try:
        await st.add_participant(participant)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Пользователь уже является участником мероприятия'
        )


async def get_event(event_uuid: UUID, is_editor=False):
    if is_editor:
        return await st.get_event_for_editor(event_uuid)
    return await st.get_event_for_visitor(event_uuid)


async def update_event(event_uuid: UUID, data: dict):
    await st.update_event(data, event_uuid)
