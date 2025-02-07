from fastapi import FastAPI
from routers.TesseractRouter import t_router

app = FastAPI()
app.include_router(t_router)

@app.get("/")
async def hello():
    return "Hello, world!"