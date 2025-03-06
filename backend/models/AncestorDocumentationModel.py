from typing import List
from pydantic import BaseModel
from models.DocumentationUpdateModel import DocumentationUpdateModel

class AncestorDocumentationModel(BaseModel):
    count: int
    documentation: List[DocumentationUpdateModel]