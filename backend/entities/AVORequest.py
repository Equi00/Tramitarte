from sqlalchemy import Column, String, Date, Integer, Enum
import datetime
from sqlalchemy.orm import relationship
from database.Database import Base
from enums.Gender import Gender

class AVORequest(Base):
    __tablename__ = "avo_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)

    processes = relationship("Process", back_populates="request_avo")

    def is_valid(self):
        """Validates if the request has correct data."""
        return (
            bool(self.first_name.strip()) and 
            bool(self.last_name.strip()) and 
            self.birth_date < datetime.date.today()
        )