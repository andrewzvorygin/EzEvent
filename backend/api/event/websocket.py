from collections import defaultdict
from uuid import UUID

from fastapi import WebSocket, WebSocketDisconnect
from starlette.responses import HTMLResponse

# from main import app
from .endpoints import event_router
from core import database

from .schemes import Event
from .models import event_orm


class ConnectionManager:
    def __init__(self):
        self.active_connections: list = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


# @app.websocket('/ws')
# async def update_event_websocket(websocket: WebSocket, event_id: UUID):
#     await manager.connect(websocket, event_id)
#     try:
#         while True:
#             data: str = await websocket.receive_text()
#             await manager.broadcast(data, event_id)
#     except WebSocketDisconnect:
#         manager.disconnect(websocket, event_id)
#
