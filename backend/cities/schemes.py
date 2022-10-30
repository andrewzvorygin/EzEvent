from pydantic import BaseModel, validator


class City(BaseModel):
    id: int | None = None
    city: str

    @validator('city')
    def upper_city(self, value: str):
        return value.upper()
