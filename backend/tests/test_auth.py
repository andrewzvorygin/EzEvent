import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from auth.models import users, black_list_token

pytestmark = pytest.mark.asyncio


async def test_registration(async_client: AsyncClient, get_session_db: AsyncSession):
    payload = {
        "email": "user@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }

    response = await async_client.post("/auth/registration", json=payload)
    assert response.status_code == 200
    result = await get_session_db.execute(users.select().where(users.c.email == payload['email']))
    user = dict(result.first())
    assert user['email'] == payload['email']

    response_with_error = await async_client.post("/auth/registration", json=payload)
    assert response_with_error.status_code == 400


async def test_login(async_client: AsyncClient):
    payload = {
        "email": "user@example.com",
        "password": "string"
    }

    response = await async_client.post("/auth/login", json=payload)
    assert response.status_code == 200
    assert 'access_token' in response.json()

    payload['password'] = 'wrong_password'
    response = await async_client.post("/auth/login", json=payload)
    assert response.status_code == 401


async def test_is_auth(async_client: AsyncClient):
    payload = {
        "email": "user@example.com",
        "password": "string"
    }

    response_login = await async_client.post("/auth/login", json=payload)
    access_token = response_login.json()['access_token']
    response_is_auth = await async_client.get('/auth/isAuth', headers={'token': access_token})
    assert response_is_auth.status_code == 200
    assert 'user_id' in response_is_auth.json()


async def test_logout(async_client: AsyncClient, get_session_db: AsyncSession):
    payload = {
        "email": "user@example.com",
        "password": "string"
    }

    response_login = await async_client.post("/auth/login", json=payload)
    access_token = response_login.json()['access_token']
    assert response_login.status_code == 200
    response_logout = await async_client.delete('/auth/logout', headers={'token': access_token})
    assert response_logout.status_code == 200
    token_db = await get_session_db.execute(black_list_token.select().where(black_list_token.c.token == access_token))
    assert token_db.first()
    response_logout = await async_client.delete('/auth/logout', headers={'token': access_token})
    assert response_logout.status_code == 401
