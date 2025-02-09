from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from entities.AVORequest import AVORequest
from entities.Documentation import *
from database.Database import Base

class Process(Base):
    __tablename__ = "processes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String, nullable=False)

    stage_id = Column(Integer, ForeignKey("stages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    request_avo_id = Column(Integer, ForeignKey("avo_requests.id"), nullable=True)

    stage = relationship("Stage", back_populates="processes")
    user = relationship("User", back_populates="processes")
    request_avo = relationship("AVORequest", back_populates="processes")

    documentations = relationship("Documentation", back_populates="process", cascade="all, delete-orphan")

    avo_documentation = relationship("AvoDocumentation", back_populates="process", cascade="all, delete-orphan")
    user_documentation = relationship("UserDocumentation", back_populates="process", cascade="all, delete-orphan")
    descendant_documentation = relationship("DescendantDocumentation", back_populates="process", cascade="all, delete-orphan")
    translated_documentation = relationship("TranslatedDocumentation", back_populates="process", cascade="all, delete-orphan")
    attachments_to_translate = relationship("AttachmentDocumentation", back_populates="process", cascade="all, delete-orphan")

    descendant_count = Column(Integer, default=0)

    def assign_avo_request(self, avo_request: AVORequest):
        self.request_avo = avo_request

    def has_translated_documentation(self):
        return len(self.translated_documentation) == len(self.attachments_to_translate)

    def advance_stage(self):
        self.stage.verify_stage(self)

    def add_avo_documentation(self, documents: list[Documentation]):
        avo_documents = []
        for doc in documents:
            avo_doc = AvoDocumentation(
                name=doc.name,
                file_type=doc.file_type,
                file_base64=doc.file_base64,
            )
            avo_doc.process_id = self.id
            avo_documents.append(avo_doc)
        
        self.avo_documentation.extend(avo_documents)

    def add_user_documentation(self, documents: list[Documentation]):
        user_documents = []
        for doc in documents:
            user_doc = UserDocumentation(
                name=doc.name,
                file_type=doc.file_type,
                file_base64=doc.file_base64,
            )
            user_doc.process_id = self.id
            user_documents.append(user_doc)
        
        self.user_documentation.extend(user_documents)

    def add_descendant_documentation(self, documents: list[Documentation]):
        descendant_documents = []
        for doc in documents:
            descendant_doc = DescendantDocumentation(
                name=doc.name,
                file_type=doc.file_type,
                file_base64=doc.file_base64,
            )
            descendant_doc.process_id = self.id
            descendant_documents.append(descendant_doc)
        
        self.descendant_documentation.extend(descendant_documents)

    def add_attachments_to_translate(self, documents: list[Documentation]):
        attachments = []
        for doc in documents:
            attachment = AttachmentDocumentation(
                name=doc.name,
                file_type=doc.file_type,
                file_base64=doc.file_base64,
            )
            attachment.process_id = self.id
            attachments.append(attachment)
        
        self.attachments_to_translate.extend(attachments)

    def add_translated_documentation(self, documents: list[Documentation]):
        translateds = []
        for doc in documents:
            translated = TranslatedDocumentation(
                name=doc.name,
                file_type=doc.file_type,
                file_base64=doc.file_base64,
            )
            translated.process_id = self.id
            translateds.append(translated)

        self.translated_documentation.extend(translateds)

