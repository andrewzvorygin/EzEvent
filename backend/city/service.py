from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.engine import CursorResult
from sqlalchemy.ext.asyncio import AsyncSession

from starlette import status

from .models import city


CITY_NOT_FOUND = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Город с таким идентификатором не найден'
        )


def get_city(city_id: int):
    return select(city).where(city.c.id == city_id)


def get_city_by_prefix(prefix: str):
    return select(city).where(city.c.name.like(f'{prefix.upper()}%'))


async def find_city_by_prefix(prefix: str, session: AsyncSession):
    smtp = get_city_by_prefix(prefix)
    cities: CursorResult = await session.execute(smtp)
    await session.commit()
    return cities.fetchall()


async def get_city_by_id(city_id: int, session: AsyncSession):
    smtp = get_city(city_id)
    result: CursorResult = await session.execute(smtp)
    await session.commit()
    return result.fetchone()
