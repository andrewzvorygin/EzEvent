# from fastapi.testclient import TestClient
#
# from sqlalchemy import create_engine
# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# from sqlalchemy.orm import sessionmaker
#
# from core.base import Base
# from core.database import get_session
#
# from main import app
#
# DATABASE_URL = f'postgresql://postgres:Za20010614@localhost:5432/FastTest'
# engine = create_engine(DATABASE_URL)
# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)
#
#
# DATABASE_URL = f'postgresql+asyncpg://postgres:Za20010614@localhost:5432/FastTest'
# engine_async = create_async_engine(DATABASE_URL, echo=True)
# async_session = sessionmaker(
#     engine_async, class_=AsyncSession, expire_on_commit=False
# )
#
#
# async def get_session_test() -> AsyncSession:
#
#     async with async_session() as session:
#         yield session
#         await session.commit()
#
# app.dependency_overrides[get_session] = get_session_test
#
