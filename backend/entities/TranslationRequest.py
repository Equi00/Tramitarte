from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from database.Database import Base

class TranslationRequest(Base):
    __tablename__ = "translation_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    translator_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    requester = relationship("User", foreign_keys=[requester_id])
    translator = relationship("User", foreign_keys=[translator_id])