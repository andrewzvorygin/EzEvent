import json
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from schemes import UserFromToken, UserRead, EventRead, Key
from api.auth.service import get_current_user
from schemes.event import Navigation

from . import service
from .websocket import manager

event_router = APIRouter(prefix='/event', tags=['event'])


@event_router.get('/read/{event}', response_model=EventRead)
async def get_event(event: UUID):
    event = await service.get_event(event)
    return event


@event_router.post('/')
async def create_empty(current_user: UserFromToken = Depends(get_current_user)):
    uuid_edit = await service.create_empty_event(current_user)
    return {'uuid_edit': uuid_edit}


@event_router.get('/my_events')
async def get_events(
        limit: int,
        offset: int,
        typeUser: int,
        date_start: datetime = datetime.min,
        date_end: datetime = datetime.max,
        current_user: UserFromToken = Depends(get_current_user)
):
    """Получить список моих мероприятий """
    res = await service.get_my_events(
        date_start,
        date_end,
        Navigation(limit=limit, offset=offset),
        typeUser,
        current_user
    )
    return {'Events': res}


@event_router.get('/events_registry')
async def get_registry(
        limit: int,
        offset: int,
        date_start: datetime = datetime.min,
        date_end: datetime = datetime.max,
        location: int = None
):
    """Получить реестр мероприятий"""
    res = await service.get_registry(Navigation(limit=limit, offset=offset), date_start, date_end, location)
    return {'Events': res}


@event_router.post('/organizers/key_invite/{event}')
async def get_key_invite(event: UUID, current_user: UserFromToken = Depends(get_current_user)):
    """Получить ключ-приглашение для мероприятия. Доступно только ответственному за мероприятие"""
    await service.check_responsible(event, current_user)
    key = await service.get_key_invite(event_uuid=event)
    return {'key': key}


@event_router.put('/organizers/key_invite/{event}')
async def update_key_event(event: UUID, current_user: UserFromToken = Depends(get_current_user)):
    """Обновить ключ-приглашение для мероприятия. Доступно только ответственному за мероприятие"""
    await service.check_responsible(event, current_user)
    key = await service.update_key_invite(event_uuid=event)
    return {'key': key}


@event_router.post('/organizers/{event}')
async def add_organizer(
        key: Key, event: UUID, current_user: UserFromToken = Depends(get_current_user)
):
    """Добавить редактора"""
    await service.add_editor_by_key(event, key.key, current_user)


@event_router.websocket("/ws/{event_uuid}")
async def websocket_endpoint(
        websocket: WebSocket,
        event_uuid: UUID,
        access_token: str
):
    current_user: UserFromToken = await get_current_user(access_token)
    await service.check_editor(event_uuid, current_user)
    await manager.connect(websocket, event_uuid)
    try:
        while True:
            data: str = await websocket.receive_text()
            await manager.broadcast(data, event_uuid)
            await service.update_event(event_uuid, json.loads(data))
    except WebSocketDisconnect:
        await manager.disconnect(websocket, event_uuid)


@event_router.get('/search/email', response_model=list[UserRead])
async def search_by_email(email_prefix: str):
    """Поиск пользователей по email"""
    return await service.search_users_by_email(email_prefix)


@event_router.post('/organizers/email/{event}')
async def add_editor_by_email(
        event: UUID, user_id: int,
        current_user: UserFromToken = Depends(get_current_user)
):
    await service.check_responsible(event, current_user)
    await service.add_editor(event_uuid=event, user_id=user_id)


@event_router.post('/visit/{event}')
async def add_visitor(
        event: UUID, current_user: UserFromToken = Depends(get_current_user)
):
    await service.add_visitor(event, current_user)
