from fastapi import HTTPException, Depends
from pydantic import ValidationError

from sqlalchemy import select
from sqlalchemy.engine import CursorResult
from sqlalchemy.ext.asyncio import AsyncSession

from starlette import status

from core import database

from .models import city_table
from .schemes import CityModel

CITY_NOT_FOUND = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Город с таким идентификатором не найден'
        )


def get_city_template(city_id: int):
    return select(city_table).where(city_table.c.id == city_id)


def get_city_by_prefix(prefix: str):
    return select(city_table).where(city_table.c.name.like(f'{prefix.upper()}%'))


async def find_cities_by_prefix(prefix: str):
    smtp = get_city_by_prefix(prefix)
    return await database.fetch_all(smtp)


async def get_city_by_id(city_id: int):
    smtp = get_city_template(city_id)
    return await database.fetch_one(smtp)


async def get_city(city_orm=Depends(get_city_by_id)):
    try:
        city = CityModel.from_orm(city_orm)
    except ValidationError:
        raise CITY_NOT_FOUND
    return city
