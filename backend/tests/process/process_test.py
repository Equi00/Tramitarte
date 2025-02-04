from entities.AVORequest import AVORequest
from entities.User import User
from entities.Documentation import *
from enums.Gender import Gender
from datetime import date
from entities.Stage import *
from database.Database import Base, SessionLocal, engine
from entities.Process import Process
import pytest


@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_process(session):
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", type="TypeA", descendant_count=2)

    process.stage_id = stage.id

    session.add(process)
    session.commit()
    
    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert retrieved is not None
    assert retrieved.code == "PRC123"
    assert retrieved.type == "TypeA"
    assert retrieved.descendant_count == 2

def test_assign_avo_request(session):
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", type="TypeA")

    process.stage_id = stage.id

    avo_request = AVORequest(first_name="John", last_name="Doe", birth_date=date(2000, 1, 1), gender=Gender.MALE)
    
    session.add(avo_request)
    session.commit()
    
    process.assign_avo_request(avo_request)
    session.add(process)
    session.commit()
    
    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert retrieved.request_avo is not None
    assert retrieved.request_avo.first_name == "John"

def test_has_translated_documentation(session):
    stage = Stage1(description="Load AVO")

    session.add(stage)
    session.commit()

    process = Process(code="PRC789", type="TypeC")
    process.stage_id = stage.id

    doc1 = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_attachments_to_translate([doc1, doc2])

    assert len(process.attachments_to_translate) == 2
    assert process.attachments_to_translate[0].document_type == "attachment"

    process.add_translated_documentation([doc1, doc2])

    assert len(process.translated_documentation) == 2
    assert process.translated_documentation[0].document_type == "translated"

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC789").first()
    assert len(retrieved.translated_documentation) == 2
    assert len(retrieved.attachments_to_translate) == 2
    assert retrieved.has_translated_documentation() is True
    assert len(retrieved.documentations) == 4

def test_add_attachments_to_translate(session):
    stage = Stage1(description="Load AVO")
    session.add(stage)
    session.commit()

    process = Process(code="PRC789", type="TypeC")
    process.stage_id = stage.id

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_attachments_to_translate([doc, doc2])

    assert len(process.attachments_to_translate) == 2

    assert isinstance(process.attachments_to_translate[0], AttachmentDocumentation)
    assert isinstance(process.attachments_to_translate[1], AttachmentDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC789").first()
    assert len(retrieved.attachments_to_translate) == 2
    assert retrieved.attachments_to_translate[0].name == "doc3"
    assert retrieved.attachments_to_translate[0].process_id == retrieved.id
    assert isinstance(retrieved.attachments_to_translate[0], AttachmentDocumentation)

def test_add_translated_documentation(session):
    stage = Stage1(description="Load AVO")
    session.add(stage)
    session.commit()

    process = Process(code="PRC789", type="TypeC")
    process.stage_id = stage.id

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_translated_documentation([doc, doc2])

    assert len(process.translated_documentation) == 2

    assert isinstance(process.translated_documentation[0], TranslatedDocumentation)
    assert isinstance(process.translated_documentation[1], TranslatedDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC789").first()
    assert len(retrieved.translated_documentation) == 2
    assert retrieved.translated_documentation[0].name == "doc3"
    assert retrieved.translated_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.translated_documentation[0], TranslatedDocumentation)

def test_add_user_documentation(session):
    stage = Stage1(description="Load AVO")
    session.add(stage)
    session.commit()

    process = Process(code="PRC789", type="TypeC")
    process.stage_id = stage.id

    doc = TranslatedDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = TranslatedDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_user_documentation([doc, doc2])

    assert len(process.user_documentation) == 2

    assert isinstance(process.user_documentation[0], UserDocumentation)
    assert isinstance(process.user_documentation[1], UserDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC789").first()
    assert len(retrieved.user_documentation) == 2
    assert retrieved.user_documentation[0].name == "doc3"
    assert retrieved.user_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.user_documentation[0], UserDocumentation)

def test_add_avo_documentation(session):
    stage = Stage1(description="Load AVO")
    session.add(stage)
    session.commit()

    process = Process(code="PRC789", type="TypeC")
    process.stage_id = stage.id

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_avo_documentation([doc, doc2])

    assert len(process.avo_documentation) == 2

    assert isinstance(process.avo_documentation[0], AvoDocumentation)
    assert isinstance(process.avo_documentation[1], AvoDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC789").first()
    assert len(retrieved.avo_documentation) == 2
    assert retrieved.avo_documentation[0].name == "doc3"
    assert retrieved.avo_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.avo_documentation[0], AvoDocumentation)

def test_add_descendant_documentation(session):
    stage = Stage1(description="Load AVO")
    session.add(stage)
    session.commit()

    process = Process(code="PRC789", type="TypeC")
    process.stage_id = stage.id

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_descendant_documentation([doc, doc2])

    assert len(process.descendant_documentation) == 2

    assert isinstance(process.descendant_documentation[0], DescendantDocumentation)
    assert isinstance(process.descendant_documentation[1], DescendantDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC789").first()
    assert len(retrieved.descendant_documentation) == 2
    assert retrieved.descendant_documentation[0].name == "doc3"
    assert retrieved.descendant_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.descendant_documentation[0], DescendantDocumentation)