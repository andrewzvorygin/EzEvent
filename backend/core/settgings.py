import os

from dotenv import load_dotenv
from pydantic import BaseSettings

load_dotenv()


class DataBaseSettings(BaseSettings):
    db_pass: str
    db_host: str
    db_port: str
    db_name: str
    db_user: str

    class Config:
        env_file = ".env"


class AppSettings(BaseSettings):
    secret_key: str
    secret_key_csrf: str
    host: str = 'localhost'
    port: int = 8000

    class Config:
        env_file = ".env"


class Settings(BaseSettings):
    app: AppSettings = AppSettings()
    db: DataBaseSettings = DataBaseSettings()
    testing: bool | None

    class Config:
        env_file = ".env"


settings = Settings()

SECRET_KEY = os.getenv('SECRET_KEY')
SECRET_KEY_CSRF = os.getenv('SECRET_KEY_CSRF')

# Настройки подключения к базе данных
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')

TESTING = os.getenv("TESTING")


# Настройки хост и порт сервера приложения
_port = os.getenv('PORT') or 8000
HOST = os.getenv('HOST') or 'localhost'
PORT = int(_port)

# Настройка каталогов статичных файлов
ROOT_PATH = os.getcwd()
STATIC_FILE = 'static'
STATIC_FILE_PATH = os.path.join(ROOT_PATH, STATIC_FILE)

if not os.path.exists(STATIC_FILE_PATH):
    os.mkdir(STATIC_FILE)

PHOTO_PROFILE = 'profile_photo'
PHOTO_PROFILE_PATH = os.path.join(STATIC_FILE_PATH, PHOTO_PROFILE)

if not os.path.exists(PHOTO_PROFILE_PATH):
    os.mkdir(PHOTO_PROFILE_PATH)

_default = 'default.png'
_default_photo_path = os.path.join(PHOTO_PROFILE_PATH, _default)
DEFAULT_PROFILE_PHOTO = 'None'

if os.path.exists(_default_photo_path):
    DEFAULT_PROFILE_PHOTO = _default_photo_path

PHOTO_COMPANY = 'company_photo'
PHOTO_COMPANY_PATH = os.path.join(STATIC_FILE_PATH, PHOTO_COMPANY)

if not os.path.exists(PHOTO_COMPANY_PATH):
    os.mkdir(PHOTO_COMPANY_PATH)
