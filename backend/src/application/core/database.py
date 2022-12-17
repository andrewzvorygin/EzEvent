import databases

from sqlalchemy.orm import declarative_base

from .settings import settings


db = settings.db
if settings.testing:
    SQLALCHEMY_DATABASE_URL = (
        f'postgresql://{db.db_user}:{db.db_pass}@{db.db_host}:{db.db_port}/{db.db_name}Test'
    )
else:
    SQLALCHEMY_DATABASE_URL = (
        f'postgresql://{db.db_user}:{db.db_pass}@{db.db_host}:{db.db_port}/{db.db_name}'
    )
database = databases.Database(SQLALCHEMY_DATABASE_URL)


Base = declarative_base()
