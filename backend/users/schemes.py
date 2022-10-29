import uuid

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    email: EmailStr
    name: str
    surname: str
    patronymic: str = None


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
