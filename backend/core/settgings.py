import os

from dotenv import load_dotenv


load_dotenv()

DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')


_port = os.getenv('PORT') or 8000
HOST = os.getenv('HOST') or 'localhost'
PORT = int(_port)

SECRET_KEY = os.getenv('SECRET_KEY')

ROOT_PATH = os.getcwd()

STATIC_FILE = os.path.join(ROOT_PATH, 'static')
