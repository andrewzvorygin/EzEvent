import re
import uuid

from pydantic import BaseModel, EmailStr, validator


class User(BaseModel):
    email: EmailStr
    name: str
    surname: str
    patronymic: str = None
    phone: str | None = None
    photo: str | None = None

    @validator('phone')
    def is_valid_phone_number(cls, value):
        if value is None:
            return None
        phone_regular = re.fullmatch(r'(\+7|8)\d{10}', value)
        if not phone_regular:
            raise ValueError(f"Не валидный номер {value}")
        return value


class UserPassword(User):
    password: str


class UserRead(User):
    uuid: uuid.UUID
    is_admin: bool = False
    disabled: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
