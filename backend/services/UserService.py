from typing import List, Optional
from fastapi import Depends, HTTPException
from models.CreateUserModel import CreateUserModel
from sqlalchemy.orm import sessionmaker
from entities.User import User
from entities.Notification import Notification
from entities.TranslationRequest import TranslationRequest
from models.NotificationModel import NotificationModel
from models.UpdateUserModel import UpdateUserModel
from enums.Role import Role

class UserService:
    def __init__(self, db):
        self.db = db
    
    def find_translators(self) -> List[User]:
        return self.db.query(User).filter(User.role == Role.TRANSLATOR).all()
    
    def find_by_role(self, role: Role) -> List[User]:
        return self.db.query(User).filter(User.role == role).all()
    
    def find_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def create(self, user_data: CreateUserModel) -> User:
        user = User(**user_data.model_dump()) 
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def find_by_email(self, email: str) -> User:
        self.validate_email_format(email)
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="No registered user with this email.")
        return user
    
    def find_translator_by_email(self, email: str) -> List[User]:
        self.validate_email_format(email)
        return self.db.query(User).filter(User.role == Role.TRANSLATOR, User.email.contains(email)).first()
    
    def find_notifications_by_user_destination_id(self, user_id: int) -> List[NotificationModel]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        notifications = self.db.query(Notification).filter(Notification.user_destination == user).all()
        return [NotificationModel(id=n.id, user_origin_id=n.user_origin.id, user_destination_id=n.user_destination.id, description=n.description) for n in notifications]
    
    def find_translation_requests(self, translator_id: int) -> List[TranslationRequest]:
        translator = self.db.query(User).filter(User.id == translator_id).first()
        if not translator:
            raise HTTPException(status_code=404, detail="Translator not found.")
        return self.db.query(TranslationRequest).filter(TranslationRequest.translator == translator).all()
    
    def find_translation_requests_by_requester_and_translator(self, requester_id: int, translator_id: int) -> List[TranslationRequest]:
        requester = self.db.query(User).filter(User.id == requester_id).first()
        translator = self.db.query(User).filter(User.id == translator_id).first()
        if not requester or not translator:
            raise HTTPException(status_code=404, detail="User(s) not found.")
        return self.db.query(TranslationRequest).filter(TranslationRequest.requester == requester, TranslationRequest.translator == translator).all()
    
    def find_request_by_requester(self, requester_id: int) -> Optional[TranslationRequest]:
        requester = self.db.query(User).filter(User.id == requester_id).first()
        if not requester:
            raise HTTPException(status_code=404, detail="Requester not found.")
        return self.db.query(TranslationRequest).filter(TranslationRequest.requester == requester).first()
    
    def update(self, user_id: int, update_data: UpdateUserModel) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        user.update_user(update_data)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete(self, user_id: int) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        self.db.delete(user)
        self.db.commit()
        
        return user
    
    def validate_email_format(self, email: str):
        import re
        if not re.match(r'^[0-9A-Za-z.-]+@[A-Za-z]+\.[a-zA-Z]+$', email):
            raise HTTPException(status_code=400, detail="Invalid email format. It should be in the form name@domain.extension")