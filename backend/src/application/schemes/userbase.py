import re
from uuid import UUID, uuid4
from datetime import datetime

from pydantic import BaseModel, EmailStr, validator


class UserBase(BaseModel):
    email: EmailStr
    name: str
    surname: str
    patronymic: str | None = None
    phone: str | None = None

    class Config:
        orm_mode = True

    @validator('phone')
    def is_valid_phone_number(cls, value):
        if value is None:
            return None
        phone_regular = re.fullmatch(r'(\+7|8)\d{10}', value)
        if not phone_regular:
            raise ValueError(f"Не валидный номер {value}")
        return value


class UserCreate(UserBase):
    password: str


class UserPassword(UserCreate):
    user_id: int


class UserRead(UserCreate):
    user_id: int
    uuid: UUID
    is_admin: bool = False
    photo: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class UserFromToken(BaseModel):
    user_id: int
    email: EmailStr
    uuid: UUID
    is_admin: bool
    in_system: bool = True

    class Config:
        orm_mode = True


class RefreshSession(BaseModel):
    user_id: int
    refresh_session: UUID = uuid4()
    access_token: str | None
    expires_in: int
    time_created: datetime

    class Config:
        orm_mode = True
