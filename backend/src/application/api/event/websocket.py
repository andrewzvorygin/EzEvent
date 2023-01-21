import json
from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket

from .service import get_event, get_editors
from schemes import FullEvent


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, list] = defaultdict(list)

    async def connect(self, websocket: WebSocket, event_uuid: UUID):
        event = await get_event(event_uuid, is_editor=True)
        editors = await get_editors(event_uuid)
        full_event = FullEvent(**event.dict(), editors=editors)
        await websocket.accept()
        await websocket.send_text(full_event.json())
        self.active_connections[event_uuid].append(websocket)

    async def disconnect(self, websocket: WebSocket, event: UUID):
        self.active_connections[event].remove(websocket)

    async def add_editor(self, event_uuid):
        event = await get_event(event_uuid, is_editor=True)
        editors = await get_editors(event_uuid)
        result = {**event.dict(), 'editors': editors}
        for connection in self.active_connections[event_uuid]:
            await connection.send_text(json.dumps(result))

    async def broadcast(self, message: str, event: UUID):
        for connection in self.active_connections[event]:
            await connection.send_text(message)


manager = ConnectionManager()
