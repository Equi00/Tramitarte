from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from database.Database import Base

class DownloadRequest(Base):
    __tablename__ = "download_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    translator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    translator = relationship("User", foreign_keys=[translator_id])
    requester = relationship("User", foreign_keys=[requester_id])
    documentation = relationship("Documentation", back_populates="download_request")