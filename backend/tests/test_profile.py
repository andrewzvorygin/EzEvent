import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_get_profile(async_client: AsyncClient):
    new_user = {
        "email": "user1@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    await async_client.post("/auth/registration", json=new_user)
    response_login = await async_client.post("/auth/login", json=new_user)
    assert response_login.status_code == 200
    access_token = response_login.json()['access_token']
    response_profile = await async_client.get("/profile/", headers={'token': access_token})
    assert response_profile.status_code == 200
    assert response_profile.json()['email'] == new_user['email']
    assert response_profile.json()['phone'] is None


async def test_put_profile(async_client: AsyncClient):
    new_user = {
        "email": "user_update@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    await async_client.post("/auth/registration", json=new_user)
    response_login = await async_client.post("/auth/login", json=new_user)
    assert response_login.status_code == 200
    access_token = response_login.json()['access_token']
    new_user["phone"] = "+79123456789"
    response_update = await async_client.put('/profile/', json=new_user, headers={'token': access_token})
    assert response_update.status_code == 202

