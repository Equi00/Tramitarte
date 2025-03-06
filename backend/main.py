import pkgutil
import importlib
from fastapi import FastAPI
from database.Database import engine, Base
from routers.TesseractRouter import t_router
from routers.UserRouter import u_router
from routers.NotificationRouter import n_router
from routers.DownloadRequestRouter import dr_router
from routers.TranslationTaskRouter import tk_router
from routers.ProcessRouter import p_router
from fastapi.middleware.cors import CORSMiddleware
import entities

for _, module_name, _ in pkgutil.iter_modules(entities.__path__):
    importlib.import_module(f"entities.{module_name}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite solicitudes desde el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

app.include_router(t_router)
app.include_router(u_router)
app.include_router(n_router)
app.include_router(dr_router)
app.include_router(tk_router)
app.include_router(p_router)

entities.Base.metadata.create_all(bind=engine)