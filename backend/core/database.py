import databases
import sqlalchemy

from sqlalchemy.orm import declarative_base

from .settgings import DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD

DB_DRIVER = 'psycopg2'

DATABASE_URL = f'postgresql+{DB_DRIVER}://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

database = databases.Database(DATABASE_URL)

Base = declarative_base()

engine = sqlalchemy.create_engine(DATABASE_URL)
