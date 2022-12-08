from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID

from core.database import Base


class Event(Base):
    __tablename__ = 'Event'
    event_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(
        UUID(), server_default=text("gen_random_uuid()"),
        nullable=False, unique=True, index=True
    )
    uuid_edit = Column(
        UUID(), server_default=text("gen_random_uuid()"),
        nullable=False, unique=True, index=True
    )
    date_start = Column(DateTime(timezone=True))
    date_end = Column(DateTime(timezone=True))
    title = Column(String)
    description = Column(String)
    responsible_id = Column(Integer, ForeignKey('User.user_id'))
    visibility = Column(Boolean, default=False)
    photo_cover = Column(String)
    key_invite = Column(String(10))


event_orm = Event.__table__


class Stage(Base):
    __tablename__ = 'Stage'
    stage_id = Column(Integer, primary_key=True, autoincrement=True)
    date_start = Column(DateTime(timezone=True))
    date_end = Column(DateTime(timezone=True))
    title = Column(String)
    description = Column(String)
    visibility = Column(Boolean, default=False)
    event_id = Column(Integer, ForeignKey('Event.event_id'))
    number = Column(Integer)


stage_orm = Stage.__table__


class Edit(Base):
    __tablename__ = 'Edit'
    edit_id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey('Event.event_id'))
    user_id = Column(Integer, ForeignKey('User.user_id'))
    __table_args__ = (
        UniqueConstraint('event_id', 'user_id', name='user_pk'),
    )


editor_orm = Edit.__table__