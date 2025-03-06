from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from enums.Role import Role


class UserModel(BaseModel):
    id: int
    username: str
    name: str
    surname: str
    role: Role
    email: EmailStr
    birthdate: date
    need_traduction: bool
    photo: Optional[str] = None