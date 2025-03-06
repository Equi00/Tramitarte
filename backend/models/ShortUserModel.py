from pydantic import BaseModel, EmailStr


class ShortUserModel(BaseModel):
    id: int
    username: str
    email: EmailStr