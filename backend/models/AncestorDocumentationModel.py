from typing import List
from pydantic import BaseModel
from models.DocumentationModel import DocumentationModel

class AncestorDocumentationModel(BaseModel):
    count: int
    documentation: List[DocumentationModel]