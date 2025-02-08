import pkgutil
import importlib
from fastapi import FastAPI
from database.Database import engine, Base
from routers.TesseractRouter import t_router
from routers.UserRouter import u_router
import entities

for _, module_name, _ in pkgutil.iter_modules(entities.__path__):
    importlib.import_module(f"entities.{module_name}")

app = FastAPI()
app.include_router(t_router)
app.include_router(u_router)

entities.Base.metadata.create_all(bind=engine)