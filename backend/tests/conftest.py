import asyncio
from typing import Generator

import pytest
import pytest_asyncio

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from .settings import async_session

from main import app


@pytest.fixture(scope="session")
def event_loop(request) -> Generator:
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture()
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture()
async def get_session_db() -> AsyncSession:
    async with async_session() as session:
        yield session
