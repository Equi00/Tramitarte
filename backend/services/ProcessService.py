import uuid
from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from entities.AVORequest import AVORequest
from entities.Process import Process
from entities.User import User
from entities.Stage import *
from entities.Documentation import Documentation
from services.UserService import UserService


class ProcessService:
    def __init__(self, db, user_service: UserService):
        self.db = db
        self.user_service = user_service

    def start_process(self, user_id: int) -> Process:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        process = Process(code=str(uuid.uuid4()), user=user, stage=Stage1(description="Upload AVO"))

        self.db.add(process.stage)
        self.db.add(process)
        self.db.commit()
        self.db.refresh(process)

        return process
    
    def upload_avo(self, process_id: int, avo: AVORequest) -> Process:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        process.assign_avo_request(avo)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_user_documents(self, process_id: int, user_documents: List[Documentation]) -> Process:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        process.add_user_documentation(user_documents)
        selected_documents = [doc for doc in user_documents if doc.file_type.lower() == "pdf"]
        process.add_attachments_to_translate(selected_documents)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_avo_documents(self, process_id: int, avo_documents: List[Documentation]) -> Process:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        process.add_avo_documentation(avo_documents)
        process.add_attachments_to_translate(avo_documents)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_descendants_documents(self, process_id: int, descendants_documents: List[Documentation]) -> Process:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        process.add_descendant_documentation(descendants_documents)
        process.add_attachments_to_translate(descendants_documents)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_translated_documents(self, user_id: int, translated_documents: List[Documentation]) -> Process:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        process: Process = self.db.query(Process).filter(Process.user_id == user.id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        process.add_translated_documentation(translated_documents)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def get_documents(self, process_id: int) -> List[Documentation]:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        document_list = process.documentations

        return document_list

    def delete_process(self, process_id: int):
        process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="The process to delete does not exist.")
        self.db.delete(process)
        self.db.commit()

    def find_by_user(self, user: Optional[User]) -> Optional[Process]:
        return self.db.query(Process).filter(Process.user_id == user.id).first() if user else None
