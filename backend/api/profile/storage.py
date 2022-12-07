from sqlalchemy import update

from api.auth.models import user_orm
from api.auth import schemes as sh
from core import database


async def update_profile(update_data: sh.User, current_user: sh.UserRead):
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
