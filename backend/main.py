import uvicorn
from fastapi import FastAPI

from core import database, HOST, PORT
from core.events import set_city_in_db

from auth import auth_router
from profile import profile_router
from city import cities_router
from event import event_router


app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(cities_router)
# app.include_router(event_router)


@app.on_event("startup")
async def startup():
    await database.connect()
    await set_city_in_db()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, log_level="info", port=PORT)
