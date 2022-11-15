from fastapi import APIRouter, Response, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_session
from .service import find_city_by_prefix, get_city_by_id, CITY_NOT_FOUND
from .schemes import CityModel

cities_router = APIRouter(prefix='/city')


@cities_router.get('/', tags=['city'], response_model=CityModel)
async def get_city(city_id: int, session: AsyncSession = Depends(get_session)):
    city = await get_city_by_id(city_id, session)
    if city is None:
        raise CITY_NOT_FOUND
    return city


@cities_router.get('/get_by_prefix', tags=['city'], response_model=list[CityModel])
async def get_cities(prefix: str, session: AsyncSession = Depends(get_session)):
    return await find_city_by_prefix(prefix, session)


@cities_router.post('/set_cookie', tags=['city'])
async def set_cookie(city_id: int, response: Response, session: AsyncSession = Depends(get_session)):
    city_ = await get_city_by_id(city_id, session)
    if not city_:
        raise CITY_NOT_FOUND
    response.set_cookie(key='city_id', value=str(city_.id))
    return {'status': status.HTTP_200_OK}
