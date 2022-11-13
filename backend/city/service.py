from sqlalchemy import select

from .models import city
from .schemes import CityModel

from core import database


async def find_city_by_prefix(prefix: str):
    smtp = select(city).where(city.c.name.like(f'{prefix.upper()}%'))
    cities = await database.fetch_all(smtp)
    return cities


async def get_city_by_id(city_id: int):
    smtp = select(city).where(city.c.id == city_id)
    answer = await database.fetch_one(smtp)
    return CityModel(**answer) if answer else None

