from uuid import UUID

from fastapi import APIRouter, Depends, WebSocket
from starlette.responses import HTMLResponse

from api.auth.schemes import UserRead
from api.auth.service import get_current_user

from . import service
from .schemes import Key

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


html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@event_router.get("/")
async def get():
    return HTMLResponse(html)


