from pydantic import BaseModel

class DocumentationModel(BaseModel):
    id: int
    name: str
    file_type: str
    file_base64: str