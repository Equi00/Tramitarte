from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from database.Database import Base

class TranslationTask(Base):
    __tablename__ = "translation_tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    process_id = Column(Integer, ForeignKey("processes.id"), nullable=False)
    process = relationship("Process", foreign_keys=[process_id])
    
    translator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    translator = relationship("User", foreign_keys=[translator_id])