from sqlalchemy import update, select

from models import user_orm
import schemes as sh
from core import database


async def update_profile(update_data: sh.ProfileUser, current_user: sh.UserFromToken):
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


async def get_user_info(user_id: int):
    smtp = select(user_orm).where(user_orm.c.user_id == user_id)
    result = await database.fetch_one(smtp)
    return result