from sqlalchemy import Column, String, Integer
from database.Database import Base

class Documentation(Base):
    __tablename__ = 'documentation'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    file_base64 = Column(String, nullable=False)