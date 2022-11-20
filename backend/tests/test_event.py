import pytest
from fastapi.testclient import TestClient
from main import app

PAYLOAD_RESPONSIBLE = {
    "email": "responsible@example.com",
    "name": "string",
    "surname": "string",
    "patronymic": "string",
    "password": "string"
}

PAYLOAD_USER_READ = {
    "email": "user_read@example.com",
    "name": "string",
    "surname": "string",
    "patronymic": "string",
    "password": "string"
}


@pytest.fixture(scope='module')
def register_responsible():
    with TestClient(app) as client:
        client.post("/auth/registration", json=PAYLOAD_RESPONSIBLE)


@pytest.fixture(scope='function')
def access_token_responsible(register_responsible):
    with TestClient(app) as client:
        response_log = client.post("/auth/login", json=PAYLOAD_RESPONSIBLE)
        access_token = response_log.json()['access_token']
        return access_token


@pytest.fixture(scope='module')
def register_user_read():
    with TestClient(app) as client:
        client.post("/auth/registration", json=PAYLOAD_USER_READ)


@pytest.fixture(scope='function')
def access_token_user_read(register_user_read):
    with TestClient(app) as client:
        response_log = client.post("/auth/login", json=PAYLOAD_USER_READ)
        access_token = response_log.json()['access_token']
        return access_token


def test_create_empty(access_token_responsible):
    with TestClient(app) as client:
        response = client.post('/event/', headers={'token': access_token_responsible})
        assert response.status_code == 200
        uuid_edit = response.json()['uuid_edit']
        assert uuid_edit


def test_get_update_key_event(access_token_responsible, access_token_user_read):
    with TestClient(app) as client:
        response = client.post('/event/', headers={'token': access_token_responsible})
        event_id = response.json()['uuid_edit']
        response_1 = client.post(
            f'/event/organizers/key_invite/{event_id}',
            headers={'token': access_token_responsible}
        )
        assert response_1.status_code == 200
        assert response_1.json()['key']
        key_1 = response_1.json()['key']
        response_2 = client.put(
            f'/event/organizers/key_invite/{event_id}',
            headers={'token': access_token_responsible}
        )
        assert response_2.status_code == 200
        assert response_2.json()['key']
        key_2 = response_2.json()['key']
        assert key_1 != key_2

        response_3 = client.post(
            f'/event/organizers/key_invite/{event_id}',
            headers={'token': access_token_user_read}
        )
        assert response_3.status_code == 403
