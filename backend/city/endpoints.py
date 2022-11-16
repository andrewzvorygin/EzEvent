from fastapi import APIRouter, Response, status, Depends

from .service import find_cities_by_prefix, get_city as get_city_db
from .schemes import CityModel

cities_router = APIRouter(prefix='/city')


@cities_router.get('/', tags=['city'], response_model=CityModel)
async def get_city(city: CityModel = Depends(get_city_db)):
    return city


@cities_router.get('/get_by_prefix', tags=['city'], response_model=list[CityModel])
async def get_cities(cities: list[CityModel] = Depends(find_cities_by_prefix)):
    return cities


@cities_router.post('/set_cookie', tags=['city'])
async def set_cookie(response: Response, city: CityModel = Depends(get_city_db)):
    response.set_cookie(key='city_id', value=str(city.id))
    return {'status': status.HTTP_200_OK}
