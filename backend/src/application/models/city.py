"""Модуль городов"""

from core.database import Base

from sqlalchemy import Column, String, Integer


class City(Base):
    __tablename__ = 'City'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False, index=True)


city_orm = City.__table__
