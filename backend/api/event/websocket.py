from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket

from . import schemes as sch


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, list] = defaultdict(list)

    async def connect(self, websocket: WebSocket, event: UUID):
        await websocket.accept()
        self.active_connections[event].append(websocket)

    async def disconnect(self, websocket: WebSocket, event: UUID):
        self.active_connections[event].remove(websocket)

    async def broadcast(self, message: str, event: UUID):
        for connection in self.active_connections[event]:
            await connection.send_text(message)


manager = ConnectionManager()
