from sqlalchemy import Column, Integer, text, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from core.database import Base


class Company(Base):
    __tablename__ = 'Company'
    company_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(
        UUID(), server_default=text("gen_random_uuid()"),
        nullable=False, unique=True, index=True
    )
    name = title = Column(String)
    photo = Column(String)
    description = Column(String)
    responsible = Column(Integer, ForeignKey('User.user_id'))


company = Company.__table__


class Editor(Base):
    __tablename__ = 'Editor'
    user_id = Column(Integer, ForeignKey('User.user_id'))
    company_id = Column(Integer, ForeignKey('Company.company_id'))


editor = Editor.__table__
