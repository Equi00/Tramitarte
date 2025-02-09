from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated, List
from database.Database import SessionLocal
from models.TranslationTaskModel import TranslationTaskModel
from sqlalchemy.orm import Session
from services.TranslationTaskService import TranslationTaskService

tk_router = APIRouter(prefix="/api/task", tags=["Translation Requests"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_translation_task_service(db: db_dependency):
    return TranslationTaskService(db)

@tk_router.post("/requester/{requester_id}/translator/{translator_id}")
async def create_translation_task(
    requester_id: int,
    translator_id: int,
    service: TranslationTaskService = Depends(get_translation_task_service),
):
    return service.create_translation_task(requester_id, translator_id)


@tk_router.get("/translator/{translator_id}", response_model=List[TranslationTaskModel])
async def get_tasks_by_translator(
    translator_id: int,
    service: TranslationTaskService = Depends(get_translation_task_service),
):
    return service.find_by_translator(translator_id)


@tk_router.get("/process/{process_id}", response_model=List[TranslationTaskModel])
async def get_tasks_by_process(
    process_id: int,
    service: TranslationTaskService = Depends(get_translation_task_service),
):
    return service.find_by_process(process_id)


@tk_router.delete("/{request_id}")
async def delete_translation_task(
    request_id: int,
    service: TranslationTaskService = Depends(get_translation_task_service),
):
    service.delete_by_id(request_id)
    return {"message": "Request successfully deleted"}
