from pydantic import BaseModel

from models.ProcessModel import ProcessModel

class TranslationTaskModel(BaseModel):
    id: int
    process: ProcessModel
    translator_id: int