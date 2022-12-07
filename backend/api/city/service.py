from fastapi import HTTPException, Depends
from pydantic import ValidationError

from starlette import status

from .schemes import CityModel
from . import storage

CITY_NOT_FOUND = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Город с таким идентификатором не найден'
        )


async def get_city(city_orm=Depends(storage.get_city)):
    try:
        city = CityModel.from_orm(city_orm)
    except ValidationError:
        raise CITY_NOT_FOUND
    return city


async def get_cities(prefix: str):
    return await storage.find_cities(prefix)
