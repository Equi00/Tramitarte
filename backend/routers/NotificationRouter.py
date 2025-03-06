from fastapi import APIRouter, Body, Depends, HTTPException, Query
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session
from models.NotificationModel import NotificationModel
from models.UserModel import UserModel
from database.Database import SessionLocal
from services.NotificationService import NotificationService

n_router = APIRouter(prefix="/api/notification", tags=["Notification"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_notification_service(db: db_dependency):
    return NotificationService(db)


@n_router.get("/{user_destination_id}", response_model=List[NotificationModel])
async def get_notifications(
    user_destination_id: int,
    service: NotificationService = Depends(get_notification_service)
):
    try:
        return service.find_all_notifications_by_user_destination(user_destination_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@n_router.post("/alert-translator/{origin_id}/{destination_id}")
async def create_alert_for_translator(
    origin_id: int,
    destination_id: int,
    description: str,
    service: NotificationService = Depends(get_notification_service)
):
    try:
        return service.generate_alert_to_translator(origin_id, destination_id, description)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@n_router.post("/alert/{origin_id}/{destination_id}")
async def create_alert(
    origin_id: int,
    destination_id: int,
    description: str,
    service: NotificationService = Depends(get_notification_service)
):
    try:
        return service.generate_alert(origin_id, destination_id, description)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@n_router.delete("/alert/{notification_id}", response_model=NotificationModel)
async def delete_alert(
    notification_id: int,
    service: NotificationService = Depends(get_notification_service)
):
    return service.delete_notification_by_id(notification_id)


@n_router.delete("/request/{request_id}")
async def delete_translation_request(
    request_id: int,
    service: NotificationService = Depends(get_notification_service)
):
    return service.delete_translation_request(request_id)


@n_router.delete("/request/requester/{requester_id}")
async def delete_translation_request_by_requester(
    requester_id: int,
    service: NotificationService = Depends(get_notification_service)
):
    return service.delete_translation_request_by_requester(requester_id)
