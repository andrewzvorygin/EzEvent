from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Event(BaseModel):
    date_start: datetime
    date_end: datetime
    title: str
    description: str
    visibility: bool

    class Config:
        orm_mode = True


class EventRead(Event):
    event_id: int
    uuid: UUID
    uuid_edit: UUID
    photo_cover: str | None
    responsible_id: int
    key_invite: str | None


class Editor(BaseModel):
    user_id: int
    event_id: int
