from fastapi import APIRouter, Response, status, Depends

from . import service
from schemes import City

cities_router = APIRouter(prefix='/city')


@cities_router.get('/', tags=['city'], response_model=City)
async def get_city(city: City = Depends(service.get_city)):
    return city


@cities_router.get('/get_by_prefix', tags=['city'], response_model=list[City])
async def get_cities(cities: list[City] = Depends(service.get_cities)):
    return cities


@cities_router.post('/set_cookie', tags=['city'])
async def set_cookie(response: Response, city: City = Depends(service.get_city)):
    response.set_cookie(key='city_id', value=str(city.id))
    return {'status': status.HTTP_200_OK}
