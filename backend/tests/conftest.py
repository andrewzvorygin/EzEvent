import os

# Устанавливаем `os.environ`, чтобы использовать тестовую БД
os.environ['TESTING'] = 'True'


from alembic import command
from alembic.config import Config
from core.database import SQLALCHEMY_DATABASE_URL

from sqlalchemy_utils import create_database, drop_database, database_exists


os.environ['DB_NAME'] = os.getenv('DB_NAME') + 'Test'


if database_exists(SQLALCHEMY_DATABASE_URL):
    drop_database(SQLALCHEMY_DATABASE_URL)  # удаляем БД

create_database(SQLALCHEMY_DATABASE_URL)  # Создаем БД
base_dir = os.path.dirname(os.path.dirname(__file__))
alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))  # Загружаем конфигурацию alembic
command.upgrade(alembic_cfg, "head")  # выполняем миграции
