from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Event(BaseModel):
    date_start: datetime
    date_end: datetime
    title: str
    description: str
    visibility: bool


class EventRead(Event):
    event_id: int
    event_uuid: UUID
    event_uuid_edit: UUID
    photo_cover: str | None
    responsible_id: int


class Editor(BaseModel):
    user_id: int
    event_id: int
