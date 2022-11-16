from fastapi.testclient import TestClient

from main import app


def test_get_profile():
    new_user = {
        "email": "user1@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    with TestClient(app) as client:
        client.post("/auth/registration", json=new_user)
        response_login = client.post("/auth/login", json=new_user)
        access_token = response_login.json()['access_token']
        response_profile = client.get("/profile/", headers={'token': access_token})
    assert response_profile.status_code == 200
    assert response_profile.json()['email'] == new_user['email']
    assert response_profile.json()['phone'] is None


def test_put_profile():
    new_user = {
        "email": "user_update@example.com",
        "name": "string",
        "surname": "string",
        "patronymic": "string",
        "password": "string"
    }
    with TestClient(app) as client:
        client.post("/auth/registration", json=new_user)
        response_login = client.post("/auth/login", json=new_user)
        assert response_login.status_code == 200
        access_token = response_login.json()['access_token']
        new_user["phone"] = "+79123456789"
        response_update = client.put('/profile/', json=new_user, headers={'token': access_token})
        assert response_update.status_code == 202
