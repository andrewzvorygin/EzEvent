from fastapi import APIRouter, Response, status

from .service import find_city_by_prefix, get_city_by_id
from .schemes import CityModel

cities_router = APIRouter(prefix='/city')


@cities_router.get('/', tags=['city'], response_model=CityModel)
async def get_city_by_id(city_id: int):
    return await get_city_by_id(city_id)


@cities_router.get('/get_by_prefix', tags=['city'], response_model=list[CityModel])
async def get_cities(prefix: str):
    return await find_city_by_prefix(prefix)


@cities_router.post('/set_cookie', tags=['city'])
async def set_cookie(city_id: int, response: Response):
    city_ = await get_city_by_id(city_id)
    if not city_:
        return status.HTTP_404_NOT_FOUND
    response.set_cookie(key='city_id', value=str(city_.id))
    return status.HTTP_200_OK
