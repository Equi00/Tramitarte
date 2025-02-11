from pydantic import BaseModel

class DocumentationModel(BaseModel):
    name: str
    file_type: str
    file_base64: str