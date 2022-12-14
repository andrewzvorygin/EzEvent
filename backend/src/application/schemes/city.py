from pydantic import BaseModel, validator


class City(BaseModel):
    id: int | None = None
    name: str

    @validator('name')
    def upper_city(cls, value: str):
        return value.upper()

    class Config:
        orm_mode = True
