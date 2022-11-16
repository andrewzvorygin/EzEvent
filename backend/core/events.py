import os

from core import ROOT_PATH
from core.database import database
from city import city_table as city_model


def get_cities():
    cities_name = []
    path = os.path.join(ROOT_PATH, 'city_name.txt')

    with open(path, 'r', encoding='utf-8') as file:
        for city in file.readlines():
            cities_name.append({'name': city.strip()})

    return cities_name


# TODO Переделать на фикстуры
async def set_city_in_db():
    city_select = city_model.select().limit(1)
    city = await database.fetch_one(city_select)
    if not city:
        cities = get_cities()
        smtp = city_model.insert()
        await database.execute_many(smtp, values=cities)
