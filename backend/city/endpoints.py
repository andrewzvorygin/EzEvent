from fastapi import APIRouter

from .service import find_city_by_prefix
from .schemes import CityModel

cities_router = APIRouter(prefix='/city')


@cities_router.get('/get_by_prefix', tags=['city'], response_model=list[CityModel])
async def get_cities(prefix: str):
    return await find_city_by_prefix(prefix)
