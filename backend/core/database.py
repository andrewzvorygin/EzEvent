import databases

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from sqlalchemy.orm import declarative_base, sessionmaker

from .settgings import DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASS, TESTING


if TESTING:
    DB_NAME = DB_NAME + 'Test'

SQLALCHEMY_DATABASE_URL = (
        f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
database = databases.Database(SQLALCHEMY_DATABASE_URL)


DB_DRIVER_PSYCOPG = 'psycopg2'
DB_DRIVER_ASYNC = 'asyncpg'

DATABASE_URL = f'postgresql+{DB_DRIVER_ASYNC}://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'


Base = declarative_base()

engine_async = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(
    engine_async, class_=AsyncSession, expire_on_commit=False
)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
