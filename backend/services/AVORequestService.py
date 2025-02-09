from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.UserModel import UserModel
from models.AVORequestModel import AVORequestModel
from entities.AVORequest import AVORequest
from entities.Process import Process
from entities.User import User 


class AVORequestService:
    def __init__(self, db):
        self.db = db

    def save(self, avo_request: AVORequestModel) -> AVORequestModel:
        avo = AVORequest(**avo_request.model_dump())

        if not avo.is_valid():
            raise HTTPException(status_code=400, detail="AVO is not valid.")

        self.db.add(avo)
        self.db.commit()
        self.db.refresh(avo)

        return avo

    def update(self, avo_request: AVORequestModel) -> AVORequestModel:
        self._validate_existing_request(avo_request)

        avo = self.db.query(AVORequest).filter(AVORequest.id == avo_request.id).first()

        for key, value in avo_request.model_dump().items():
            setattr(avo, key, value)

        if not avo.is_valid():
            raise HTTPException(status_code=400, detail="AVO is not valid.")

        self.db.commit()
        self.db.refresh(avo)
        return avo

    def find_avo_by_user(self, user: UserModel) -> Optional[AVORequestModel]:
        user = self.db.query(User).filter_by(id = user.id).first()
        process = self.db.query(Process).filter_by(user_id = user.id).first()
        return process.request_avo if process else None

    def _validate_existing_request(self, avo_request: AVORequestModel):
        existing_request = self.db.query(AVORequest).filter(AVORequest.id == avo_request.id).first()
        if not existing_request:
            raise HTTPException(status_code=404, detail="The AVO to modify does not exist.")