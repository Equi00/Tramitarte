from pydantic import BaseModel

class TranslationRequestModel(BaseModel):
    id: int
    requester_id: int
    translator_id: int
