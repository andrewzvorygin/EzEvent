from fastapi.testclient import TestClient

from main import app


def test_get_city_by_prefix():
    prefix = 'ека'
    with TestClient(app) as client:
        response = client.get('/city/get_by_prefix', params={'prefix': prefix})
    assert response.status_code == 200
    cities = response.json()
    assert cities is not None
    for city in cities:
        assert city['name'].startswith(prefix.upper())


def test_get_city():
    with TestClient(app) as client:
        response = client.get('/city/', params={'city_id': 1})
        assert response.status_code == 200

        response = client.get('/city/', params={'city_id': 1111})
        assert response.status_code == 404


def test_set_cookie():
    data = {'city_id': 2}
    with TestClient(app) as client:
        response = client.post('/city/set_cookie', params=data)
    assert response.status_code == 200
