"""Модуль городов"""
# Вынес отдельно, чтобы в будущем избежать циклического импорта

from core.base import Base

from sqlalchemy import Column, String, Integer


class City(Base):
    __tablename__ = 'City'
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False, index=True)


city = City.__table__
