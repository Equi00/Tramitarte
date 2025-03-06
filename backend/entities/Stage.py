from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, declared_attr
from exceptions.InvalidDocumentationException import InvalidDocumentationException
from database.Database import Base



class Stage(Base):
    __tablename__ = 'stages'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String, nullable=False)
    stage_type = Column(String, nullable=False)

    processes = relationship("Process", back_populates="stage")

    __mapper_args__ = {
        "polymorphic_identity": "stage",
        "polymorphic_on": stage_type
    }

    def verify_stage(self, process):
        raise NotImplementedError("This method should be implemented by subclasses.")

class Stage1(Stage):
    __tablename__ = 'stage1'
    
    id = Column(Integer, ForeignKey('stages.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "stage1"
    }

    def verify_stage(self, process):
        if not process.request_avo.is_valid():
            raise InvalidDocumentationException("AVO data is invalid")
        process.stage = Stage2(description="Load User Documentation")

class Stage2(Stage):
    __tablename__ = 'stage2'
    
    id = Column(Integer, ForeignKey('stages.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "stage2"
    }

    def __init__(self, description="Load User Documentation"):
        super().__init__(description=description)

    def verify_stage(self, process):
        if len(process.user_documentation) < 3:
            raise InvalidDocumentationException("The user documentation presented is insufficient")
        process.stage = Stage3(description="Load AVO Documentation")

class Stage3(Stage):
    __tablename__ = 'stage3'
    
    id = Column(Integer, ForeignKey('stages.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "stage3"
    }

    def __init__(self, description="Load AVO Documentation"):
        super().__init__(description=description)

    def verify_stage(self, process):
        if len(process.avo_documentation) < 1:
            raise InvalidDocumentationException("The AVO documentation presented is insufficient")
        process.stage = Stage4(description="Load Ancestors Documentation")

class Stage4(Stage):
    __tablename__ = 'stage4'
    
    id = Column(Integer, ForeignKey('stages.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "stage4"
    }

    def __init__(self, description="Load Ancestors Documentation"):
        super().__init__(description=description)

    def verify_stage(self, process):
        if len(process.ancestors_documentation) < process.ancestor_count:
            raise InvalidDocumentationException("The process is missing necessary ancestor documents")
        process.stage = Stage5(description="Load Translated Documentation")

class Stage5(Stage):
    __tablename__ = 'stage5'
    
    id = Column(Integer, ForeignKey('stages.id'), primary_key=True)

    __mapper_args__ = {
        "polymorphic_identity": "stage5"
    }

    def __init__(self, description="Load Translated Documentation"):
        super().__init__(description=description)

    def verify_stage(self, process):
        if not process.has_translated_documentation():
            raise InvalidDocumentationException("The process is missing translated documents")
        process.stage = Stage5(description="Process Completed, click to download files")

