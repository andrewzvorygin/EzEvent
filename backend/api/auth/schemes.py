import re
import uuid

from pydantic import BaseModel, EmailStr, validator


class User(BaseModel):
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


class UserCreate(User):
    password: str


class UserPassword(UserCreate):
    user_id: int


class UserRead(User):
    user_id: int
    uuid: uuid.UUID
    is_admin: bool = False
    photo: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True


class AuthorizationToken(BaseModel):
    user_id: int
    token: str

    class Config:
        orm_mode = True
