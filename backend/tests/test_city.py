import os
from pathlib import Path

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from city.models import city


pytestmark = pytest.mark.asyncio


def get_path_to_file_with_cities():
    file = 'city_name.txt'
    dir_to_file = Path(__file__).parents[1]
    return os.path.join(dir_to_file, file)


def get_cities_by_path_file(path):
    cities = []
    with open(path, 'r', encoding='utf-8') as file_read:
        for line in file_read:
            city_ = line.strip()
            cities.append({'name': city_})
    return cities


def get_cities():
    path = get_path_to_file_with_cities()
    cities = get_cities_by_path_file(path)
    return cities


async def set_cities_in_db(get_session_db: AsyncSession):
    cities = get_cities()
    smtp = city.insert()
    await get_session_db.execute(smtp, cities)
    await get_session_db.commit()


async def test_get_city_by_prefix(async_client: AsyncClient, get_session_db: AsyncSession):
    await set_cities_in_db(get_session_db)

    response = await async_client.get('/city/get_by_prefix', params={'prefix': 'ека'})
    assert response.status_code == 200
    assert response.json()[0]['name'] == 'ЕКАТЕРИНБУРГ'


async def test_get_city(async_client: AsyncClient):
    response = await async_client.get('/city/', params={'city_id': 1})
    assert response.status_code == 200

    response = await async_client.get('/city/', params={'city_id': 1111})
    assert response.status_code == 404


# async def test_set_cookie(async_client: AsyncClient):
#     data = {'city_id': 2}
#     response = await async_client.post('/city/set_cookie', json=data)
#     assert response.status_code == 200
