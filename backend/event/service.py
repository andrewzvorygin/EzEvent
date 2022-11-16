from uuid import UUID
from collections import defaultdict

from fastapi import WebSocket, WebSocketDisconnect

from core.database import database
from auth.schemes import UserRead

from .models import event_table
from .schemes import EventRead


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, [WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, event_id: UUID):
        await websocket.accept()
        self.active_connections[event_id].append(websocket)

    def disconnect(self, websocket: WebSocket, event_id: UUID):
        self.active_connections[event_id].remove(websocket)
        if not self.active_connections[event_id]:
            self.active_connections.pop(event_id)

    async def broadcast(self, message: str, event_id: UUID):
        for connection in self.active_connections[event_id]:
            await connection.send_text(message)


manager = ConnectionManager()


async def create_empty_event(current_user: UserRead):
    smtp = await create_empty_event_template(current_user)
    return await database.execute(smtp)


async def create_empty_event_template(current_user):
    return event_table.insert().values(responsible_id=current_user.user_id).returning(event_table.c.uuid_edit)


async def get_event_by_uuid(event_uuid: UUID):
    smtp = event_table.select().where(event_table.c.uuid == event_uuid)
    event_ = await database.fetch_one(smtp)
    return EventRead(**dict(event_))


async def websocket_(websocket: WebSocket, event_id: UUID):
    await manager.connect(websocket, event_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data, event_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, event_id)
