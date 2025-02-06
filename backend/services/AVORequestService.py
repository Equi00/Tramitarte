from sqlalchemy.orm import Session
from fastapi import HTTPException
from entities.AVORequest import AVORequest
from entities.Process import Process
from entities.User import User 
from services.ProcessService import ProcessService  


class AVORequestService:
    def __init__(self, db, process_service: ProcessService):
        self.db = db
        self.process_service = process_service

    def save(self, avo_request: AVORequest) -> AVORequest:
        if not avo_request.is_valid():
            raise HTTPException(status_code=400, detail="AVO is not valid.")

        self.db.add(avo_request)
        self.db.commit()
        self.db.refresh(avo_request)

        return avo_request

    def update(self, avo_request: AVORequest) -> AVORequest:
        self._validate_existing_request(avo_request)
        if not avo_request.is_valid():
            raise HTTPException(status_code=400, detail="AVO is not valid.")

        self.db.commit()
        self.db.refresh(avo_request)
        return avo_request

    def find_avo_by_user(self, user: User) -> AVORequest:
        process = self.process_service.find_by_user(user)
        return process.request_avo if process else None

    def _validate_existing_request(self, avo_request: AVORequest):
        existing_request = self.db.query(AVORequest).filter(AVORequest.id == avo_request.id).first()
        if not existing_request:
            raise HTTPException(status_code=404, detail="The AVO to modify does not exist.")