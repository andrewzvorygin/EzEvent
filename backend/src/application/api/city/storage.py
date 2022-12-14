from sqlalchemy import select

from src.application.core import database
from models import city_orm


async def get_city(city_id: int):
    smtp = select(city_orm).where(city_orm.c.id == city_id)
    return await database.fetch_one(smtp)


async def find_cities(prefix: str):
    smtp = select(city_orm).where(city_orm.c.name.like(f'{prefix.upper()}%'))
    return await database.fetch_all(smtp)
