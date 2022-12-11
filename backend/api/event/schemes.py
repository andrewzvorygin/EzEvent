from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, validator, Field


class Location(BaseModel):
    latitude: float | None
    longitude: float | None


class Event(BaseModel):
    date_start: datetime | None = None
    date_end: datetime | None = None
    title: str | None = None
    description: str | None = None
    visibility: bool = False
    latitude: float | None = Field(alias='latitude')
    longitude: float | None = Field(alias='longitude')
    location: Location | None

    class Config:
        orm_mode = True

    @validator('location')
    def set_location(cls, v, values):
        latitude = values.get('latitude')
        longitude = values.get('longitude')
        location = Location(latitude=latitude, longitude=longitude)
        return location


class EventRead(Event):
    event_id: int
    uuid: UUID
    uuid_edit: UUID
    photo_cover: str | None
    responsible_id: int


class EventForEditor(EventRead):
    key_invite: str | None


class Participant(BaseModel):
    user_id: int
    event_id: int
    is_editor: bool = False


class Key(BaseModel):
    key: str
