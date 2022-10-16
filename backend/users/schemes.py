from pydantic import BaseModel


class User(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    is_admin: bool = False
    disabled: bool = False


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
