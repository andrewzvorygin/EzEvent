from fastapi import APIRouter, Depends, WebSocket

from auth.schemes import UserRead
from auth.service import get_current_active_user

from .service import create_empty_event

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
