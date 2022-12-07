from uuid import UUID

from fastapi import APIRouter, Depends

from api.auth.schemes import UserRead
from api.auth.service import get_current_user

from . import service
from .schemes import Key

event_router = APIRouter(prefix='/event', tags=['event'])


@event_router.post('/')
async def create_empty(current_user: UserRead = Depends(get_current_user)):
    uuid_edit = await service.create_empty_event(current_user)
    return {'uuid_edit': uuid_edit}


@event_router.post('/organizers/key_invite/{event}')
async def get_key_invite(event: UUID, current_user: UserRead = Depends(get_current_user)):
    """Получить ключ-приглашение для мероприятия. Доступно только ответственному за мероприятие"""
    await service.check_responsible(event, current_user)
    key = await service.get_key_invite(event_uuid=event)
    return {'key': key}


@event_router.put('/organizers/key_invite/{event}')
async def update_key_event(event: UUID, current_user: UserRead = Depends(get_current_user)):
    """Получить ключ-приглашение для мероприятия. Доступно только ответственному за мероприятие"""
    await service.check_responsible(event, current_user)
    key = await service.update_key_invite(event_uuid=event)
    return {'key': key}


@event_router.post('/organizers/{event}')
async def add_organizer(key: Key, event: UUID, current_user: UserRead = Depends(get_current_user)):
    """Добавить редактора"""
    await service.add_editor_by_key(event, key.key, current_user)
