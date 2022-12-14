from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger
from sqlalchemy import func, text
from sqlalchemy.dialects.postgresql import UUID

from core.database import Base


class User(Base):
    __tablename__ = 'User'
    user_id = Column(Integer, primary_key=True, index=True)
    uuid = Column(
        UUID(), server_default=text("gen_random_uuid()"),
        nullable=False, unique=True, index=True
    )
    email = Column(String(100), nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    patronymic = Column(String(100))
    is_admin = Column(Boolean, server_default=text('false'), nullable=False)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    phone = Column(String)
    photo = Column(String)


user_orm = User.__table__


class RefreshToken(Base):
    __tablename__ = 'RefreshToken'
    token_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('User.user_id'), nullable=False)
    refresh_session = Column(UUID, nullable=False)
    expires_in = Column(BigInteger, nullable=False)
    time_created = Column(DateTime(timezone=True), nullable=False)


refresh_session_orm = RefreshToken.__table__
