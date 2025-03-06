import uuid
from typing import List, Optional
from fastapi import Depends, HTTPException
from models.DocumentationUpdateModel import DocumentationUpdateModel
from models.AncestorDocumentationModel import AncestorDocumentationModel
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
        previous_stage = process.stage
        process.advance_stage()

        self.db.add(process.stage)
        self.db.delete(previous_stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_user_documents(self, process_id: int, user_documents: List[DocumentationUpdateModel]) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        user_documentation_list = []
        for doc in user_documents:
            document = UserDocumentation(**doc.model_dump())
            user_documentation_list.append(document)

        process.add_user_documentation(user_documentation_list)
        selected_documents = [doc for doc in user_documents if ".pdf" in doc.name.lower()]
        process.add_attachments_to_translate(selected_documents)
        previous_stage = process.stage
        process.advance_stage()

        self.db.add(process.stage)
        self.db.delete(previous_stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_avo_documents(self, process_id: int, avo_documents: List[DocumentationUpdateModel]) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        avo_documentation_list = []
        for doc in avo_documents:
            document = AvoDocumentation(**doc.model_dump())
            avo_documentation_list.append(document)

        process.add_avo_documentation(avo_documentation_list)
        process.add_attachments_to_translate(avo_documentation_list)
        previous_stage = process.stage
        process.advance_stage()

        self.db.add(process.stage)
        self.db.delete(previous_stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_ancestors_documents(self, process_id: int, ancestor_documentation: AncestorDocumentationModel) -> ProcessModel:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")
        
        process.ancestor_count = ancestor_documentation.count
        
        ancestor_documentation_list = []
        for doc in ancestor_documentation.documentation:
            document = AncestorDocumentation(**doc.model_dump())
            ancestor_documentation_list.append(document)

        process.add_ancestors_documentation(ancestor_documentation_list)
        process.add_attachments_to_translate(ancestor_documentation_list)
        previous_stage = process.stage
        process.advance_stage()

        self.db.add(process.stage)
        self.db.delete(previous_stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def upload_translated_documents(self, user_id: int, translated_documents: List[DocumentationUpdateModel]) -> ProcessModel:
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
        previous_stage = process.stage
        process.advance_stage()

        self.db.add(process.stage)
        self.db.delete(previous_stage)
        self.db.commit()
        self.db.refresh(process)

        return process

    def get_documents(self, process_id: int) -> List[DocumentationModel]:
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        document_list = []
        document_list.extend(process.user_documentation)
        document_list.extend(process.avo_documentation)
        document_list.extend(process.ancestors_documentation)
        document_list.extend(process.translated_documentation)

        return document_list

    def delete_process(self, process_id: int):
        process: Process = self.db.query(Process).filter(Process.id == process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="The process to delete does not exist.")
        
        if process.stage: self.db.delete(process.stage)
        if process.request_avo: self.db.delete(process.request_avo)
        self.db.delete(process)
        self.db.commit()

    def find_by_user(self, user_id: Optional[int]) -> Optional[ProcessModel]:
        return self.db.query(Process).filter(Process.user_id == user_id).first() if user_id else None
