from pydantic import BaseModel

class UpdateUserModel(BaseModel):
    username: str
    surname: str
    name: str