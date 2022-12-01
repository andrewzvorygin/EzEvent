from uuid import UUID

from fastapi import APIRouter, Depends

from auth.schemes import UserRead
from auth.service import get_current_user

from .service import create_empty_event, get_key_invite, check_responsible, update_key_invite, add_editor_by_key

event_router = APIRouter(prefix='/event', tags=['event'])


@event_router.post('/')
async def create_empty(current_user: UserRead = Depends(get_current_user)):
    uuid_edit = await create_empty_event(current_user)
    return {'uuid_edit': uuid_edit}


@event_router.post('/organizers/key_invite/{event}')
async def get_key_event(event: UUID, current_user: UserRead = Depends(get_current_user)):
    """Получить ключ-приглашение для мероприятия. Доступно только ответственному за мероприятие"""
    await check_responsible(event, current_user)
    key = await get_key_invite(event_uuid=event)
    return {'key': key}


@event_router.put('/organizers/key_invite/{event}')
async def update_key_event(event: UUID, current_user: UserRead = Depends(get_current_user)):
    """Получить ключ-приглашение для мероприятия. Доступно только ответственному за мероприятие"""
    await check_responsible(event, current_user)
    key = await update_key_invite(event_uuid=event)
    return {'key': key}


@event_router.post('/organizers/{event}')
async def add_organizer(event: UUID, key: str, current_user: UserRead = Depends(get_current_user)):
    """Добавить редактора"""
    await add_editor_by_key(event, key, current_user)
