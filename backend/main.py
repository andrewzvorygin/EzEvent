from uuid import UUID

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware

from core import database, HOST, PORT
from core.events import set_city_in_db

from api.auth import auth_router
from api.profile import profile_router
from api.city import cities_router
from api.event import event_router

from api.event.websocket import manager
app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(cities_router)
app.include_router(event_router)

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await database.connect()
    await set_city_in_db()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data: str = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, log_level="info", port=PORT)
