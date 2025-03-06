from pydantic import BaseModel

class DocumentationUpdateModel(BaseModel):
    name: str
    file_type: str
    file_base64: str
