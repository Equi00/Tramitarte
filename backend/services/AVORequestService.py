from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.UpdateAVORequestModel import UpdateAVORequestModel
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

    def update(self, avo_request: UpdateAVORequestModel) -> AVORequestModel:
        avo: AVORequest = self.db.query(AVORequest).filter(AVORequest.id == avo_request.id).first()

        self._validate_existing_request(avo)

        avo.first_name = avo_request.first_name or avo.first_name
        avo.last_name = avo_request.last_name or avo.last_name
        avo.birth_date = avo_request.birth_date or avo.birth_date
        avo.gender = avo_request.gender or avo.gender

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
         if not avo_request:
            raise HTTPException(status_code=404, detail="The AVO to modify does not exist.")