from pydantic import BaseModel

class TranslationTaskModel(BaseModel):
    id: int
    process_id: int
    translator_id: int