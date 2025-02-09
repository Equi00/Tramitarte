from typing import List, Optional
from openai import BaseModel
from models.DocumentationModel import DocumentationModel


class ProcessModel(BaseModel):
    id: int
    code: str
    stage_id: int
    user_id: int
    request_avo_id: Optional[int] = None
    descendant_count: int = 0

    documentations: List[DocumentationModel] = []
    avo_documentation: List[DocumentationModel] = []
    user_documentation: List[DocumentationModel] = []
    descendant_documentation: List[DocumentationModel] = []
    translated_documentation: List[DocumentationModel] = []
    attachments_to_translate: List[DocumentationModel] = []
