import string
import secrets
from datetime import datetime
from uuid import UUID

from fastapi import HTTPException
from starlette import status

from geopy import Nominatim

from schemes import UserFromToken, UserRead, Participant, EventFromDB
from schemes.event import Navigation, CommentCreate
from . import storage as st
from api.city.storage import get_city_2


async def check_responsible(event_uuid: UUID, current_user: UserFromToken):
    event = await st.get_event_for_editor(event_uuid)
    if event.responsible_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Действие доступно только ответственному за мероприятие'
        )


async def check_editor(event_uuid: UUID, current_user: UserFromToken):
    editors_id = await st.get_editors_id(event_uuid)
    if current_user.user_id not in editors_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Действие доступно только редакторам'
        )


async def create_empty_event(current_user: UserFromToken) -> UUID:
    event_identifier = await st.create_event(current_user)
    editor = Participant(user_id=current_user.user_id, event_id=event_identifier['event_id'], is_editor=True)
    await st.add_participant(editor)
    return event_identifier['uuid_edit']


async def get_my_events(
        date_start: datetime,
        date_end: datetime,
        navigation: Navigation,
        type_user: int,
        search: str,
        location: int,
        current_user: UserFromToken
):
    """asdas"""
    events_id = await st.get_events_keys(current_user.user_id, type_user)
    return await st.get_events(date_start, date_end, events_id, search, location, navigation)


async def get_registry(
        navigation: Navigation,
        search: str,
        date_start: datetime,
        date_end: datetime,
        location: int
):
    return await st.get_registry(navigation, search, date_start, date_end, location)


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


async def get_visitors(event_uuid: UUID):
    return await st.get_participants(event_uuid)


async def read_event(event_uuid: UUID, current_user):
    event = await st.get_event_for_visitor(event_uuid)
    participants = await st.get_participants(event_uuid)
    editors = await st.get_event_editors(event_uuid)
    event.can_edit = True if (
            current_user
            and current_user.user_id in [editor.user_id for editor in editors]
    ) else False
    event.can_reg = True if (
            not event.can_edit
            and (
                not current_user
                or current_user.user_id not in [participant.user_id for participant in participants]
            )
    ) else False

    event.participants = [part.dict() for part in participants]
    event.editors = [editor.dict() for editor in editors]
    return event


async def get_event(event_uuid: UUID, is_editor=False):
    if is_editor:
        return await st.get_event_for_editor(event_uuid)
    return await st.get_event_for_visitor(event_uuid)


async def update_event(event_uuid: UUID, data: EventFromDB):
    data_to_update = await filter_data(data)
    if data.latitude and data.longitude:
        nom = Nominatim(user_agent='user')
        location = nom.reverse(f'{data.latitude}, {data.longitude}')
        city: str = location.raw['address'].get('city')

        if city:
            data_to_update['city'] = await get_city_2(city.upper())

    if data_to_update:
        await st.update_event(data_to_update, event_uuid)


async def filter_data(data):
    data_to_update = {}
    for key, val in data.dict().items():
        if val is not None:
            data_to_update[key] = val
    return data_to_update


async def add_comment(comment: CommentCreate):
    await st.add_comment(comment)


async def get_comments(event_id: int):
    return await st.get_comment(event_id)


async def get_editors(event_uuid):
    return await st.get_editors(event_uuid)


async def get_tags():
    return await st.get_tag()
