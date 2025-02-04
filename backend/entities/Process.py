from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from database.Database import Base

class Process(Base):
    __tablename__ = "processes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String, nullable=False)
    type = Column(String, nullable=False)

    stage_id = Column(Integer, ForeignKey("stages.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    request_avo_id = Column(Integer, ForeignKey("avo_requests.id"), nullable=True)

    stage = relationship("Stage", back_populates="processes")
    user = relationship("User", back_populates="processes")
    request_avo = relationship("AVORequest", back_populates="processes")

    attachments_to_translate = relationship("Documentation", secondary="process_attachments_to_translate")
    user_documentation = relationship("Documentation", secondary="process_user_documentation")
    avo_documentation = relationship("Documentation", secondary="process_avo_documentation")
    descendant_documentation = relationship("Documentation", secondary="process_descendant_documentation")
    translated_documentation = relationship("Documentation", secondary="process_translated_documentation")

    descendant_count = Column(Integer, default=0)

    def assign_avo_request(self, avo_request):
        self.request_avo = avo_request

    def has_translated_documentation(self):
        return len(self.translated_documentation) == len(self.attachments_to_translate)

    def advance_stage(self):
        self.stage.verify_stage(self)

    def add_attachments_to_translate(self, attachments):
        self.attachments_to_translate.extend(attachments)

