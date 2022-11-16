# import asyncio
# from typing import Generator
#
# import pytest
# import pytest_asyncio
#
# from httpx import AsyncClient
# from sqlalchemy.ext.asyncio import AsyncSession
#
# from .settings import async_session
#
# from main import app


# @pytest.fixture(scope="session")
# def event_loop(request) -> Generator:
#     loop = asyncio.get_event_loop_policy().new_event_loop()
#     yield loop
#     loop.close()
#
#
# @pytest_asyncio.fixture()
# async def async_client():
#     async with AsyncClient(app=app, base_url="http://test") as ac:
#         yield ac
#
#
# @pytest_asyncio.fixture()
# async def get_session_db() -> AsyncSession:
#     async with async_session() as session:
#         yield session
import os

# Устанавливаем `os.environ`, чтобы использовать тестовую БД
os.environ['TESTING'] = 'True'

from alembic import command
from alembic.config import Config
from core.database import SQLALCHEMY_DATABASE_URL, DB_NAME

from sqlalchemy_utils import create_database, drop_database, database_exists


os.environ['DB_NAME'] = DB_NAME


if database_exists(SQLALCHEMY_DATABASE_URL):
    drop_database(SQLALCHEMY_DATABASE_URL)  # удаляем БД

create_database(SQLALCHEMY_DATABASE_URL)  # Создаем БД
base_dir = os.path.dirname(os.path.dirname(__file__))
alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))  # Загружаем конфигурацию alembic
command.upgrade(alembic_cfg, "head")  # выполняем миграции
