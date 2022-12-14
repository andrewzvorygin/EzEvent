from fastapi import HTTPException
from starlette import status

PHOTO_NOT_FOUND = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Фотография не найдена",
    )
INVALID_FILE = HTTPException(
    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    detail='Невалидный файл'
)
