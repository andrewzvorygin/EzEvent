from pydantic import BaseSettings


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
    secret_key_solt: str
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
