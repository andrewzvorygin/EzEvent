import os

from dotenv import load_dotenv


load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

# Настройки подключения к базе данных
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')

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
