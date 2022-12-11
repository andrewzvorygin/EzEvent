import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from core import database, settings
from core.events import set_city_in_db
from core.middleware import CheckingCsrfToken

from api.auth import auth_router
from api.profile import profile_router
from api.city import cities_router
from api.event import event_router


app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(cities_router)
app.include_router(event_router)

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(CheckingCsrfToken)


@app.on_event("startup")
async def startup():
    await database.connect()
    await set_city_in_db()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.app.host, log_level="info", port=settings.app.port)
