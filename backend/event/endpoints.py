from uuid import UUID

from fastapi import APIRouter, Depends, WebSocket, Header, status

from auth.schemes import UserRead
from auth.service import get_current_user, get_current_active_user

from .service import create_empty_event, get_event_by_uuid, get_editors
from .service import EventRead

event_router = APIRouter(prefix='/event', tags=['event'])


@event_router.post('')
async def create_empty(current_user: UserRead = Depends(get_current_active_user)):
    uuid_edit = await create_empty_event(current_user)
    return uuid_edit


@event_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


@event_router.get('/{event_id}')
async def get_event(event_id: UUID, token: str | None = Header(...)):
    event = await get_event_by_uuid(event_id)
    if event.visibility:
        return EventRead(**event.dict())

    if token is not None:
        user = await get_current_user(token)
        editors = await get_editors(event_id)
        if user.user_id in editors:
            return EventRead(**event.dict())

    return status.HTTP_406_NOT_ACCEPTABLE
