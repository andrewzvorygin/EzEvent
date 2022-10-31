import uvicorn
from fastapi import FastAPI

from core import database

from auth import auth_router
from profile import profile_router
from cities import cities_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(cities_router)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

if __name__ == "__main__":
    uvicorn.run("main:app", host='localhost', log_level="info", port=8000)
