import os

from core import APPLICATION_PATH
from core.database import database
from models import city_orm


def get_cities():
    cities_name = []
    path = os.path.join(APPLICATION_PATH, 'city_name.txt')

    with open(path, 'r', encoding='LATIN1') as file:
        for city in file.readlines():
            cities_name.append({'name': city.strip()})

    return cities_name


# TODO Переделать на фикстуры
async def set_city_in_db():

    city_select = city_orm.select().limit(1)
    city = await database.fetch_one(city_select)
    if not city:
        cities = get_cities()
        smtp = city_orm.insert()
        await database.execute_many(smtp, values=cities)
