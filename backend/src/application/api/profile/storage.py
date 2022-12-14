from sqlalchemy import update

from models import user_orm
import schemes as sh
from core import database


async def update_profile(update_data: sh.UserBase, current_user: sh.UserFromToken):
    smtp = (
        update(user_orm)
        .where(user_orm.c.user_id == current_user.user_id)
        .values(**update_data.dict())
    )
    await database.execute(smtp)


async def save_photo_profile(path_to_photo, current_user_id):
    smtp = (
        update(user_orm)
        .where(user_orm.c.uuid == current_user_id)
        .values(photo=path_to_photo)
    )
    await database.execute(smtp)
