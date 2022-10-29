import sqlalchemy
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

from core.database import Base


class User(Base):
    __tablename__ = 'User'
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(
        UUID(), server_default=sqlalchemy.text("gen_random_uuid()"),
        nullable=False, unique=True, index=True
    )
    email = Column(String(100), nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    patronymic = Column(String(100))
    is_admin = Column(Boolean, nullable=False, default=False)
    disabled = Column(Boolean, nullable=False, default=False)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())


users = User.__table__


class BlackListToken(Base):
    __tablename__ = 'BlackLisToken'
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, nullable=False, index=True)
    lifetime = Column(DateTime)


black_list_token = BlackListToken.__table__
