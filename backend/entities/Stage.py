from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, declared_attr
from Process import Process
from exceptions import InvalidDocumentationException
from database.Database import Base



class Stage(Base):
    __tablename__ = 'stages'
    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String, nullable=False)
    stage_type = Column(String, nullable=False)

    processes = relationship("Process", back_populates="stage")

    @declared_attr
    def stage_type(cls):
        return Column(String)

    def verify_stage(self, process: Process):
        raise NotImplementedError("This method should be implemented by subclasses.")

class Stage1(Stage):
    __tablename__ = 'stage1'

    description = Column(String, default="Load AVO", nullable=False)

    def verify_stage(self, process: Process):
        if not process.request_avo.is_valid():
            raise InvalidDocumentationException("AVO data is invalid")
        process.stage = Stage2("Load User Documentation")

class Stage2(Stage):
    __tablename__ = 'stage2'

    def __init__(self, description: str = "Load User Documentation"):
        super().__init__(description)

    def verify_stage(self, process: Process):
        if len(process.user_documentation) < 3:
            raise InvalidDocumentationException("The documentation presented is invalid")
        process.stage = Stage3("Load AVO Documentation")

class Stage3(Stage):
    __tablename__ = 'stage3'

    def __init__(self, description: str = "Load AVO Documentation"):
        super().__init__(description)

    def verify_stage(self, process: Process):
        if len(process.avo_documentation) < 1:
            raise InvalidDocumentationException("The documentation presented is invalid")
        process.stage = Stage4("Load Descendant Documentation")

class Stage4(Stage):
    __tablename__ = 'stage4'

    def __init__(self, description: str = "Load Descendant Documentation"):
        super().__init__(description)

    def verify_stage(self, process: Process):
        if len(process.descendant_documentation) < 1:
            raise InvalidDocumentationException("The process is missing necessary descendant documents")
        process.stage = Stage5("Load Translated Documentation")

class Stage5(Stage):
    __tablename__ = 'stage5'

    def __init__(self, description: str = "Load Translated Documentation"):
        super().__init__(description)

    def verify_stage(self, process: Process):
        if not process.has_translated_documentation():
            raise InvalidDocumentationException("The process is missing translated documents")
        process.stage = Stage5("Process Completed, click to download files")

