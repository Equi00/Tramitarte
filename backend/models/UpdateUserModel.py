from typing import Optional
from pydantic import BaseModel

class UpdateUserModel(BaseModel):
    username: Optional[str] = None
    surname: Optional[str] = None
    name: Optional[str] = None