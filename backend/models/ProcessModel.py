from typing import List, Optional
from openai import BaseModel
from models.ShortUserModel import ShortUserModel
from models.StageModel import StageModel
from models.DocumentationModel import DocumentationModel


class ProcessModel(BaseModel):
    id: int
    code: str
    user: ShortUserModel
    request_avo_id: Optional[int] = None
    descendant_count: int = 0

    stage: StageModel = None
    documentations: List[DocumentationModel] = []
    avo_documentation: List[DocumentationModel] = []
    user_documentation: List[DocumentationModel] = []
    descendant_documentation: List[DocumentationModel] = []
    translated_documentation: List[DocumentationModel] = []
    attachments_to_translate: List[DocumentationModel] = []
