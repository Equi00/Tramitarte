import uuid
from typing import List, Optional
from fastapi import Depends, HTTPException
from models.StageModel import StageModel
from models.ProcessModel import ProcessModel
from models.DocumentationModel import DocumentationModel
from models.AVORequestModel import AVORequestModel
from entities.AVORequest import AVORequest
from entities.Process import Process
from entities.User import User
from entities.Stage import *
from entities.Documentation import *


class ProcessService:
    def __init__(self, db):
        self.db = db

    def start_process(self, user_id: int) -> ProcessModel:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        process = Process(code=str(uuid.uuid4()), user=user, stage=Stage1(description="Upload AVO"))

        self.db.add(process.stage)
        self.db.add(process)
        self.db.commit()
        self.db.refresh(process)

        return process
    
    def upload_avo(self, process_id: int, avo: AVORequestModel) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        avo_request = AVORequest(**avo.model_dump())
        process.assign_avo_request(avo_request)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_user_documents(self, process_id: int, user_documents: List[DocumentationModel]) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        user_documentation_list = []
        for doc in user_documents:
            document = UserDocumentation(**doc.model_dump())
            user_documentation_list.append(document)

        process.add_user_documentation(user_documentation_list)
        selected_documents = [doc for doc in user_documents if doc.file_type.lower() == "pdf"]
        process.add_attachments_to_translate(selected_documents)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_avo_documents(self, process_id: int, avo_documents: List[DocumentationModel]) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        avo_documentation_list = []
        for doc in avo_documents:
            document = AvoDocumentation(**doc.model_dump())
            avo_documentation_list.append(document)

        process.add_avo_documentation(avo_documentation_list)
        process.add_attachments_to_translate(avo_documentation_list)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_descendants_documents(self, process_id: int, descendants_documents: List[DocumentationModel]) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")
        
        descendant_documentation_list = []
        for doc in descendants_documents:
            document = DescendantDocumentation(**doc.model_dump())
            descendant_documentation_list.append(document)

        process.add_descendant_documentation(descendant_documentation_list)
        process.add_attachments_to_translate(descendant_documentation_list)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_translated_documents(self, user_id: int, translated_documents: List[DocumentationModel]) -> ProcessModel:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        process: Process = self.db.query(Process).filter(Process.user_id == user.id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        translated_documentation_list = []
        for doc in translated_documents:
            document = TranslatedDocumentation(**doc.model_dump())
            translated_documentation_list.append(document)

        process.add_translated_documentation(translated_documentation_list)
        process.advance_stage()

        self.db.add(process.stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def get_documents(self, process_id: int) -> List[DocumentationModel]:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        document_list = process.documentations

        return document_list

    def delete_process(self, process_id: int):
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="The process to delete does not exist.")
        
        self.db.delete(process.stage)
        self.db.delete(process.request_avo)
        self.db.delete(process)
        self.db.commit()

    def find_by_user(self, user_id: Optional[int]) -> Optional[ProcessModel]:
        return self.db.query(Process).filter(Process.user_id == user_id).first() if user_id else None
