from fastapi import APIRouter, Depends

from auth.schemes import UserRead
from auth.service import get_current_active_user

from .service import create_empty_event

event_router = APIRouter(prefix='/event')


@event_router.post('')
async def create_empty(current_user: UserRead = Depends(get_current_active_user)):
    uuid_edit = await create_empty_event(current_user)
    return uuid_edit
