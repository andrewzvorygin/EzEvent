import json
from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket

from .service import get_event, get_editors


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, list] = defaultdict(list)

    async def connect(self, websocket: WebSocket, event_uuid: UUID):
        event = await get_event(event_uuid, is_editor=True)
        editors = await get_editors(event_uuid)
        result = {**event.dict(), 'editors': editors}
        result['uuid_edit'] = str(result['uuid_edit'])
        result['uuid'] = str(result['uuid'])
        result['date_start'] = str(result['date_start']) if result['date_start'] else None
        result['date_end'] = str(result['date_end']) if result['date_start'] else None
        await websocket.accept()
        await websocket.send_text(json.dumps(result))
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
