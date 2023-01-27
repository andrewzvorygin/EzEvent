from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint, Float, Date, ARRAY
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
    date_start = Column(DateTime(timezone=True), default=datetime.now())
    date_end = Column(DateTime(timezone=True), default=datetime.now())
    title = Column(String)
    city = Column(Integer, ForeignKey('City.id'))
    latitude = Column(Float)
    longitude = Column(Float)
    description = Column(String)
    responsible_id = Column(Integer, ForeignKey('User.user_id'))
    visibility = Column(Boolean, default=False)
    photo_cover = Column(String)
    key_invite = Column(String(10))
    tags_id = Column(ARRAY(Integer))


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


class Participant(Base):
    __tablename__ = 'Participant'
    participant_id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey('Event.event_id'))
    user_id = Column(Integer, ForeignKey('User.user_id'))
    is_editor = Column(Boolean, default=False)
    __table_args__ = (
        UniqueConstraint('event_id', 'user_id', name='user_pk'),
    )


participant_orm = Participant.__table__


class Comment(Base):
    __tablename__ = 'Comment'
    comment_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('User.user_id'))
    text = Column(String)
    event_id = Column(Integer, ForeignKey('Event.event_id'))
    parent_id = Column(Integer)
    date_comment = Column(Date)


comment_orm = Comment.__table__


class Tag(Base):
    __tablename__ = 'Tag'
    tag_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)


tag_orm = Tag.__table__
