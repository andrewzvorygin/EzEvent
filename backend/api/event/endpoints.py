from uuid import UUID

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from pydantic import EmailStr

from api.auth.schemes import UserRead
from api.auth.service import get_current_user

from . import service
from .schemes import Key
from .websocket import manager

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


@event_router.websocket("/ws/{event_uuid}")
async def websocket_endpoint(websocket: WebSocket, event_uuid: UUID):
    await manager.connect(websocket, event_uuid)
    try:
        while True:
            data: str = await websocket.receive_text()
            await manager.broadcast(data, event_uuid)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, event_uuid)


@event_router.get('/search/email', response_model=list[UserRead])
async def search_by_email(email_prefix: str):
    """Поиск пользователей по email"""
    return await service.search_users_by_email(email_prefix)


@event_router.post('/organizers/email/{event}')
async def add_editor_by_email(
        event: UUID, user_id: int,
        current_user: UserRead = Depends(get_current_user)
):
    await service.check_responsible(event, current_user)
    await service.add_editor(event_uuid=event, user_id=user_id)


@event_router.post('/visit/{event}')
async def add_visitor(
        event: UUID, current_user: UserRead = Depends(get_current_user)
):
    await service.add_visitor(event, current_user)
