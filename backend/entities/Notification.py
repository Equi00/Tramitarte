from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from enums.NType import NType
from database.Database import Base

class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    user_origin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_destination_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    description = Column(String(150), nullable=False)
    notification_type = Column(Enum(NType), nullable=False)

    user_origin = relationship("User", foreign_keys=[user_origin_id])
    user_destination = relationship("User", foreign_keys=[user_destination_id])