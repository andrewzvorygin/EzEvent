from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy import func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

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
    visibility = Column(Boolean, default=text('false'))
    photo_cover = Column(String)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())


event_table = Event.__table__
