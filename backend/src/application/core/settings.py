import os
from pydantic import BaseSettings

dr = os.path.dirname
path_to_env = os.path.join(dr(dr(dr(dr(__file__)))), '.env')


class DataBaseSettings(BaseSettings):
    db_pass: str
    db_host: str
    db_port: str
    db_name: str
    db_user: str

    class Config:
        env_file = path_to_env


class AppSettings(BaseSettings):
    SECRET_KEY: str
    SECRET_KEY_SOLT: str
    HOST: str = 'localhost'
    PORT: int = 8000

    class Config:
        env_file = path_to_env


class Settings(BaseSettings):
    app: AppSettings = AppSettings()
    db: DataBaseSettings = DataBaseSettings()
    testing: bool | None

    class Config:
        env_file = path_to_env


settings = Settings()
