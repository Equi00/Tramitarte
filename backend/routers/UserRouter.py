from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated, List, Optional
from models.TranslationRequestModel import TranslationRequestModel
from models.UserModel import UserModel
from models.NotificationModel import NotificationModel
from services.UserService import UserService
from entities.User import User
from database.Database import SessionLocal
from models.UpdateUserModel import UpdateUserModel
from models.CreateUserModel import CreateUserModel
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

@u_router.get("/translators", response_model=List[UserModel])
async def get_translators(service: UserService = Depends(get_user_service)):
    return service.find_translators()

@u_router.get("/requesters", response_model=List[UserModel])
async def get_requesters(service: UserService = Depends(get_user_service)):
    return [user for user in service.find_by_role(Role.REQUESTER) if user.need_traduction]

@u_router.get("/{user_destination_id}/notifications", response_model=List[NotificationModel])
async def get_notifications(user_destination_id: int, service: UserService = Depends(get_user_service)):
    return service.find_notifications_by_user_destination_id(user_destination_id)


@u_router.get("/{id}", response_model=UserModel)
async def get_user_by_id(id: int, service: UserService = Depends(get_user_service)):
    user = service.find_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

@u_router.get("/", response_model=UserModel)
async def get_user_by_email(email: str, service: UserService = Depends(get_user_service)):
    return service.find_by_email(email)

@u_router.get("/{translator_id}/translation-requests", response_model=List[TranslationRequestModel])
async def get_translation_requests(translator_id: int, service: UserService = Depends(get_user_service)):
    return service.find_translation_requests(translator_id)

@u_router.get("/translation-requests/requester/{requester_id}/translator/{translator_id}", response_model=List[TranslationRequestModel])
async def get_translation_requests_by_requester_and_translator(
    requester_id: int, translator_id: int, service: UserService = Depends(get_user_service)
):
    return service.find_translation_requests_by_requester_and_translator(requester_id, translator_id)

@u_router.get("/requests/requester/{requester_id}", response_model=Optional[TranslationRequestModel])
async def get_request_by_requester(requester_id: int, service: UserService = Depends(get_user_service)):
    return service.find_request_by_requester(requester_id)

@u_router.get("/translator/email", response_model=Optional[UserModel])
async def get_translator_by_email(email: str, service: UserService = Depends(get_user_service)):
    return service.find_translator_by_email(email)

@u_router.post("/", response_model=UserModel)
async def create_user(user: CreateUserModel, service: UserService = Depends(get_user_service)):
    try:
        return service.create(user)
    except:
        raise HTTPException(status_code=400, detail="The user data is invalid.")

@u_router.put("/{id}", response_model=UserModel)
async def update_user(id: int, user: UpdateUserModel, service: UserService = Depends(get_user_service)):
    try:
        return service.update(id, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@u_router.delete("/{id}", response_model=UserModel)
async def delete_user(id: int, service: UserService = Depends(get_user_service)):
    return service.delete(id)