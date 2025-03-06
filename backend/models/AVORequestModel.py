from pydantic import BaseModel
from datetime import date
from enums.Gender import Gender

class AVORequestModel(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    gender: Gender