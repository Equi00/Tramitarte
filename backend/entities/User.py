from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Date, Enum
from database.Database import Base
from enums.Role import Role
from models.UpdateUserModel import UpdateUserModel


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(150), nullable=False)

    name = Column(String(50), nullable=False)

    surname = Column(String(50), nullable=False)

    role = Column(Enum(Role), nullable=False)

    price = Column(Float, nullable=False)

    email = Column(String(100), nullable=False, unique=True)

    birthdate = Column(Date, nullable=False)

    need_traduction = Column(Boolean, nullable=False)

    photo = Column(String(255), nullable=True)

    def update_user(self, update_model: UpdateUserModel):
        self.username = update_model.username
        self.surname = update_model.surname
        self.name = update_model.name