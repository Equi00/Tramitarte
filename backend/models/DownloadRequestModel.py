from pydantic import BaseModel
from models.DocumentationModel import DocumentationModel

class DownloadRequestModel(BaseModel):
    id: int
    translator_id: int
    requester_id: int
    documentation: list[DocumentationModel]