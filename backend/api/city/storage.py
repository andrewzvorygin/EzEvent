from sqlalchemy import select

from core import database
from .models import city_table


async def get_city(city_id: int):
    smtp = select(city_table).where(city_table.c.id == city_id)
    return await database.fetch_one(smtp)


async def find_cities(prefix: str):
    smtp = select(city_table).where(city_table.c.name.like(f'{prefix.upper()}%'))
    return await database.fetch_all(smtp)
