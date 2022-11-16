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
    assert response_1.json()['access_token'] is not None
    assert response_2.status_code == 401


def test_is_auth():
    payload = {
        "email": "user@example.com",
        "password": "string"
    }
    with TestClient(app) as client:
        response_login = client.post("/auth/login", json=payload)
        access_token = response_login.json()['access_token']
        response_is_auth = client.get('/auth/isAuth', headers={'token': access_token})
    assert response_is_auth.status_code == 200
    assert 'user_id' in response_is_auth.json()


def test_logout():
    payload = {
        "email": "user@example.com",
        "password": "string"
    }
    with TestClient(app) as client:
        response_login = client.post("/auth/login", json=payload)
        access_token = response_login.json()['access_token']
        assert response_login.status_code == 200
        response_logout = client.delete('/auth/logout', headers={'token': access_token})
        assert response_logout.status_code == 200
        response_logout = client.delete('/auth/logout', headers={'token': access_token})
        assert response_logout.status_code == 401
