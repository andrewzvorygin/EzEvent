from sqlalchemy import select

from .models import city

from core import database


async def find_city_by_prefix(prefix: str):
    smtp = select(city).where(city.c.name.like(f'{prefix.upper()}%'))
    cities = await database.fetch_all(smtp)
    return cities


