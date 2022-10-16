import uvicorn
from fastapi import FastAPI

from core.database import database

from users.endpoints import users_router

app = FastAPI()
app.include_router(users_router)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

if __name__ == "__main__":
    uvicorn.run("main:app", host='localhost', log_level="info", port=8000)
