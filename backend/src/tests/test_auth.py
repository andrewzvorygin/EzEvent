import pytest
from fastapi.testclient import TestClient

from .settints import Token

from src.application.main import app


def test_registration():
    payload = {
        "email": "user@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    logger.info('Hellloooooooooooooo')
    with TestClient(app) as client:
        response_1 = client.post("/auth/registration", json=payload)
        response_2 = client.post("/auth/registration", json=payload)
    assert response_1.status_code == 201
    assert response_2.status_code == 400


def test_login():
    payload = {
        "email": "user@example.com",
        "password": "string"
    }
    with TestClient(app) as client:
        response_1 = client.post("/auth/login", json=payload)
        payload['password'] = 'wrong_password'
        response_2 = client.post("/auth/login", json=payload)
    assert response_1.status_code == 200
    assert response_1.cookies is not None
    assert response_1.cookies['refresh_token'] is not None
    assert response_1.json() is not None
    assert response_1.json()['access_token'] is not None
    assert response_2.status_code == 401


@pytest.fixture(scope='module')
def authorization_token():
    payload = {
        "email": "user_1@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    with TestClient(app) as client:
        client.post("/auth/registration", json=payload)
        response = client.post("/auth/login", json=payload)
    access_token = response.json()['access_token']
    refresh_token = response.cookies['refresh_token']
    return Token(access_token=access_token, refresh_token=refresh_token)


def test_is_auth(authorization_token):
    with TestClient(app) as client:
        response_is_auth = client.get(
            '/auth/isAuth', headers={'access-token': authorization_token.access_token}
        )
    assert response_is_auth.status_code == 200
    assert 'user_id' in response_is_auth.json()
    assert response_is_auth.json()['user_id'] is not None


def test_refresh(authorization_token):
    with TestClient(app) as client:
        response = client.put(
            '/auth/refresh_token', cookies={'refresh_token': authorization_token.refresh_token}
        )
    assert response.status_code == 200
    assert response.cookies is not None
    assert response.cookies['refresh_token'] is not None
    assert response.json() is not None
    assert response.json()['access_token'] is not None
    assert response.cookies['refresh_token'] != authorization_token.refresh_token
    assert response.json()['access_token'] != authorization_token.access_token


def test_logout(authorization_token):
    with TestClient(app) as client:
        response_logout = client.delete(
            '/auth/logout', headers={'access-token': authorization_token.access_token}
        )
        assert response_logout.status_code == 200
        assert response_logout.json()['access_token'] != authorization_token.access_token
