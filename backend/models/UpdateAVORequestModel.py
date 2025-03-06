from typing import Optional
from pydantic import BaseModel
from datetime import date
from enums.Gender import Gender

class UpdateAVORequestModel(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[Gender] = None