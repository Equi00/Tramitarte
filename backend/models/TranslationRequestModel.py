from pydantic import BaseModel

from models.ShortUserModel import ShortUserModel

class TranslationRequestModel(BaseModel):
    id: int
    requester: ShortUserModel
    translator_id: int
