from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket

from .service import get_event


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, list] = defaultdict(list)

    async def connect(self, websocket: WebSocket, event_uuid: UUID):
        event = await get_event(event_uuid, is_editor=True)
        await websocket.accept()
        await websocket.send_text(event.json())
        self.active_connections[event_uuid].append(websocket)

    async def disconnect(self, websocket: WebSocket, event: UUID):
        self.active_connections[event].remove(websocket)

    async def broadcast(self, message: str, event: UUID):
        for connection in self.active_connections[event]:
            await connection.send_text(message)


manager = ConnectionManager()
