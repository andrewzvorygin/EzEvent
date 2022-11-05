from core.database import database

from auth.schemes import UserRead
from .models import event


async def create_empty_event(current_user: UserRead):
    smtp = event.insert().values(responsible_id=current_user.user_id).returning(event.c.uuid_edit)
    uuid_edit = await database.execute(smtp)
    return uuid_edit
