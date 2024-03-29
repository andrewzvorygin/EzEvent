from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, validator, Field


from .userbase import ShortUser, ParticipantShort, EditorShort


class TagId(BaseModel):
    tag_id: int | None = None

    class Config:
        orm_mode = True


class Location(BaseModel):
    latitude: float | None
    longitude: float | None


class Event(BaseModel):
    date_start: datetime | None = None
    date_end: datetime | None = None
    title: str | None = None
    description: str | None = None
    visibility: bool | None = None
    photo_cover: str | None = None
    tags_id: list[int] | None = []


class EventFromDB(Event):
    latitude: float | None = Field(alias='latitude')
    longitude: float | None = Field(alias='longitude')
    # location: Location | None

    class Config:
        orm_mode = True

    # @validator('location')
    # def set_location(cls, v, values):
    #     latitude = values.get('latitude')
    #     longitude = values.get('longitude')
    #     location = Location(latitude=latitude, longitude=longitude)
    #     return location


class Tag(TagId):
    name: str | None = None


class EventRead(EventFromDB):
    event_id: int
    uuid: UUID
    uuid_edit: UUID
    responsible_id: int


class RegistryEvent(EventRead):
    responsible_name: str | None = None
    responsible_surname: str | None = None
    city: str | None = None
    participants: list[ShortUser] | None
    editors: list[EditorShort] | None
    can_reg: bool | None = None
    can_edit: bool | None = None


class Navigation(BaseModel):
    limit: int
    offset: int


class EventForEditor(EventRead):
    key_invite: str | None


class Participant(BaseModel):
    user_id: int
    event_id: int
    is_editor: bool = False

    class Config:
        orm_mode = True


class Key(BaseModel):
    key: str


class EventWS(Event):
    location: Location | None
    longitude: float | None = Field(alias='longitude')
    latitude: float | None = Field(alias='latitude')

    @validator('longitude')
    def set_longitude(cls, v, values):
        location: Location = values.get('longitude')
        return location.longitude

    @validator('latitude')
    def set_latitude(cls, v, values):
        location: Location = values.get('latitude')
        return location.latitude


class CommentCreate(BaseModel):
    user_id: int | None = None
    text: str
    event_id: int
    parent_id: int | None
    date_comment: date = date.today()


class CommentRead(CommentCreate):
    comment_id: int
    name: str
    surname: str
    patronymic: str
    photo: str

    @validator('user_id')
    def set_longitude(cls, value):
        if not isinstance(value, int):
            raise ValueError()
        return value

    class Config:
        orm_mode = True


class FullEvent(EventForEditor):
    editors: list[ShortUser]
