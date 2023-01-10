from datetime import datetime
from typing import List
from uuid import UUID

from databases.interfaces import Record
from sqlalchemy import select, insert, update, join, not_

from schemes import UserRead, UserFromToken, EventRead, Participant, EventForEditor
from models import user_orm, event_orm, participant_orm
from core import database
from schemes.event import Navigation


async def get_event_for_editor(event_uuid: UUID) -> EventForEditor:
    smtp = select(event_orm).where(event_orm.c.uuid_edit == event_uuid)
    result = await database.fetch_one(smtp)
    return EventForEditor.from_orm(result)


async def get_event_for_visitor(event_uuid: UUID) -> EventRead:
    smtp = select(event_orm).where(event_orm.c.uuid == event_uuid)
    result = await database.fetch_one(smtp)
    return EventRead.from_orm(result)


async def add_participant(participant: Participant) -> None:
    smtp = (
        insert(participant_orm)
        .values(
            event_id=participant.event_id,
            user_id=participant.user_id,
            is_editor=participant.is_editor
        )
    )
    await database.execute(smtp)


async def update_key_invite(event_uuid: UUID, new_key: str) -> None:
    smtp_update_key_invite = (
        update(event_orm)
        .where(event_orm.c.uuid_edit == event_uuid)
        .values(key_invite=new_key)
    )
    await database.execute(smtp_update_key_invite)


async def create_event(current_user: UserFromToken) -> Record:
    smtp = (
        insert(event_orm)
        .values(responsible_id=current_user.user_id)
        .returning(event_orm.c.uuid_edit, event_orm.c.event_id)
    )
    return await database.fetch_one(smtp)


async def get_events_keys(user_id: int, user_type: int) -> List[int]:
    def _check_type(user_type: int):
        if user_type in (0, 1):
            return participant_orm.c.is_editor
        return not_(participant_orm.c.is_editor)

    smtp = (
        select(participant_orm)
        .where(participant_orm.c.user_id == user_id, _check_type(user_type))
    )

    res = await database.fetch_all(smtp)
    return [Participant.from_orm(key).event_id for key in res]


async def get_events(
        date_start: datetime,
        date_end: datetime,
        events_id: List[int],
        navigation: Navigation
) -> List[EventRead]:
    offset = navigation.offset * navigation.limit

    smtp = (
        select(event_orm)
        .where(
            event_orm.c.date_start >= date_start,
            event_orm.c.date_end <= date_end,
            event_orm.c.event_id.in_(events_id)
        )
        .limit(navigation.limit)
        .offset(offset)
        .order_by(event_orm.c.event_id.desc())
    )
    result = await database.fetch_all(smtp)
    return [EventRead.from_orm(event) for event in result]


async def get_registry(
        navigation: Navigation,
        date_start: datetime,
        date_end: datetime,
        location: int
):
    def _check_location(location:int):
        if location:
            return event_orm.c.city == location
        return True

    offset = navigation.offset * navigation.limit

    smtp = (
        select(event_orm)
        .where(
            event_orm.c.date_start >= date_start,
            event_orm.c.date_end <= date_end,
            event_orm.c.visibility,
            _check_location(location)
        )
        .limit(navigation.limit)
        .offset(offset)
        .order_by(event_orm.c.event_id.desc())
    )

    result = await database.fetch_all(smtp)
    return [EventRead.from_orm(event) for event in result]


async def get_key_invite(event_uuid: UUID) -> str:
    smtp = select(event_orm.c.key_invite).where(event_orm.c.uuid_edit == event_uuid)
    key = await database.fetch_val(smtp)
    return key


async def get_users_by_email(email: str) -> list[UserRead]:
    smtp = (
        select(user_orm)
        .where(user_orm.c.email.like(f'{email}%'))
    )
    result = await database.fetch_all(smtp)
    return [UserRead.from_orm(user) for user in result]


async def update_event(data: dict[str, str], event_uuid: UUID):
    smtp = (
        update(event_orm)
        .values(**data)
        .where(event_orm.c.uuid_edit == event_uuid)
    )
    await database.execute(smtp)


async def get_editors(event_uuid: UUID):
    smtp = (
        select(participant_orm.c.user_id)
        .join(event_orm, event_orm.c.event_id == participant_orm.c.event_id)
        .where(event_orm.c.uuid_edit == event_uuid and participant_orm.c.is_editor)
    )
    result = await database.fetch_all(smtp)
    return [record['user_id'] for record in result]
