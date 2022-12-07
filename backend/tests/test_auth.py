import pytest
from fastapi.testclient import TestClient
from main import app


def test_registration():
    payload = {
        "email": "user@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
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
    assert response_1.cookies['access_token'] is not None
    assert response_2.status_code == 401


@pytest.fixture(scope='module')
def cookie():
    payload = {
        "email": "user_1@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    with TestClient(app) as client:
        client.post("/auth/registration", json=payload)
        response_2 = client.post("/auth/login", json=payload)
    return response_2.cookies


def test_is_auth(cookie):
    with TestClient(app) as client:
        response_is_auth = client.get('/auth/isAuth', cookies=cookie)
    assert response_is_auth.status_code == 200
    assert 'user_id' in response_is_auth.json()


def test_logout(cookie):
    with TestClient(app) as client:
        response_logout = client.delete('/auth/logout', cookies=cookie)
        print(response_logout.json())
        assert response_logout.status_code == 200
        response_logout = client.delete('/auth/logout', cookies=cookie)
        assert response_logout.status_code == 401
