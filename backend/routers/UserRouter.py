from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated, List, Optional, Union
from services.UserService import UserService
from entities.User import User
from database.Database import SessionLocal
from models.UpdateUserModel import UpdateUserModel
from models.CreateUserModel import CreateUserModel
from entities.TranslationRequest import TranslationRequest
from sqlalchemy.orm import Session
from enums.Role import Role

u_router = APIRouter(prefix="/api/user", tags=["User"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_user_service(db: db_dependency):
    return UserService(db)

@u_router.get("/translators")
async def get_translators(service: UserService = Depends(get_user_service)):
    return service.find_translators()

@u_router.get("/requesters")
async def get_requesters(service: UserService = Depends(get_user_service)):
    return [user for user in service.find_by_role(Role.REQUESTER) if user.need_traduction]

@u_router.get("/{id}/notifications")
async def get_notifications(id: int, service: UserService = Depends(get_user_service)):
    return service.find_notifications_by_user_destination_id(id)

@u_router.post("/")
async def create_user(user: CreateUserModel, service: UserService = Depends(get_user_service)):
    try:
        return service.create(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@u_router.put("/{id}")
async def update_user(id: int, user: UpdateUserModel, service: UserService = Depends(get_user_service)):
    try:
        return service.update(id, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@u_router.get("/{id}")
async def get_user_by_id(id: int, db: db_dependency):
    user = db.query(User).filter_by(id=id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@u_router.get("/")
async def get_user_by_email(email: str, service: UserService = Depends(get_user_service)):
    try:
        return service.find_by_email(email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@u_router.get("/{id}/translation-requests")
async def get_translation_requests(id: int, service: UserService = Depends(get_user_service)):
    return service.find_translation_requests(id)

@u_router.get("/translation-requests/requester/{requester_id}/translator/{translator_id}")
async def get_translation_requests_by_requester_and_translator(
    requester_id: int, translator_id: int, service: UserService = Depends(get_user_service)
):
    return service.find_translation_requests_by_requester_and_translator(requester_id, translator_id)

@u_router.get("/requests/requester/{requester_id}")
async def get_request_by_requester(requester_id: int, service: UserService = Depends(get_user_service)):
    return service.find_request_by_requester(requester_id)

@u_router.get("/translator-email")
async def get_translator_by_email(email: str, service: UserService = Depends(get_user_service)):
    try:
        return service.find_translator_by_email(email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
