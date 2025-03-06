from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.DocumentationUpdateModel import DocumentationUpdateModel
from models.DocumentationModel import DocumentationModel
from entities.Documentation import Documentation 

class DocumentationService:
    
    def __init__(self, db):
        self.db = db

    def update(self, doc_id: int, updated_doc: DocumentationUpdateModel):
        documentation: Documentation = self.db.query(Documentation).filter(Documentation.id == doc_id).first()
        if not documentation:
            raise HTTPException(status_code=404, detail="Documentation not found.")

        documentation.file_type = updated_doc.file_type
        documentation.name = updated_doc.name
        documentation.file_base64 = updated_doc.file_base64

        self.db.commit()
        self.db.refresh(documentation)
