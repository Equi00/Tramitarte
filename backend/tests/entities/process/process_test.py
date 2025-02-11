from enums.Role import Role
from entities.AVORequest import AVORequest
from entities.User import User
from entities.Documentation import *
from enums.Gender import Gender
from datetime import date
from entities.Stage import *
from entities.DownloadRequest import DownloadRequest
from database.Database import Base, SessionLocal, engine
from entities.Process import Process
import pytest


@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    user = User(
        username="jdoe",
        name="John",
        surname="Doe",
        role=Role.TRANSLATOR,
        email="jdoe@example.com",
        birthdate=date(1990, 5, 17),
        need_traduction=False,
        photo="profile.jpg"
    )

    db_session.add(user)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_process(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    session.add(process)
    session.commit()
    
    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert retrieved is not None
    assert retrieved.code == "PRC123"
    assert retrieved.user is user
    assert retrieved.stage is stage

def test_assign_avo_request(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

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
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

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

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.translated_documentation) == 2
    assert len(retrieved.attachments_to_translate) == 2
    assert retrieved.has_translated_documentation() is True
    assert len(retrieved.documentations) == 4

def test_add_attachments_to_translate(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_attachments_to_translate([doc, doc2])

    assert len(process.attachments_to_translate) == 2

    assert isinstance(process.attachments_to_translate[0], AttachmentDocumentation)
    assert isinstance(process.attachments_to_translate[1], AttachmentDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.attachments_to_translate) == 2
    assert retrieved.attachments_to_translate[0].name == "doc3"
    assert retrieved.attachments_to_translate[0].process_id == retrieved.id
    assert isinstance(retrieved.attachments_to_translate[0], AttachmentDocumentation)

def test_add_translated_documentation(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_translated_documentation([doc, doc2])

    assert len(process.translated_documentation) == 2

    assert isinstance(process.translated_documentation[0], TranslatedDocumentation)
    assert isinstance(process.translated_documentation[1], TranslatedDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.translated_documentation) == 2
    assert retrieved.translated_documentation[0].name == "doc3"
    assert retrieved.translated_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.translated_documentation[0], TranslatedDocumentation)

def test_add_user_documentation(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    doc = TranslatedDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = TranslatedDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_user_documentation([doc, doc2])

    assert len(process.user_documentation) == 2

    assert isinstance(process.user_documentation[0], UserDocumentation)
    assert isinstance(process.user_documentation[1], UserDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.user_documentation) == 2
    assert retrieved.user_documentation[0].name == "doc3"
    assert retrieved.user_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.user_documentation[0], UserDocumentation)

def test_add_avo_documentation(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_avo_documentation([doc, doc2])

    assert len(process.avo_documentation) == 2

    assert isinstance(process.avo_documentation[0], AvoDocumentation)
    assert isinstance(process.avo_documentation[1], AvoDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.avo_documentation) == 2
    assert retrieved.avo_documentation[0].name == "doc3"
    assert retrieved.avo_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.avo_documentation[0], AvoDocumentation)

def test_add_ancestor_documentation(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    doc = UserDocumentation(name="doc3", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_ancestors_documentation([doc, doc2])

    assert len(process.ancestors_documentation) == 2

    assert isinstance(process.ancestors_documentation[0], AncestorDocumentation)
    assert isinstance(process.ancestors_documentation[1], AncestorDocumentation)

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.ancestors_documentation) == 2
    assert retrieved.ancestors_documentation[0].name == "doc3"
    assert retrieved.ancestors_documentation[0].process_id == retrieved.id
    assert isinstance(retrieved.ancestors_documentation[0], AncestorDocumentation)

def test_delete_process(session):
    user = session.query(User).filter_by(username="jdoe").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    avo_request = AVORequest(
        first_name="John",
        last_name="ASDF",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    process.assign_avo_request(avo_request)

    doc = UserDocumentation(name="doc", file_type="PDF", file_base64="encoded_string")
    doc2 = UserDocumentation(name="doc2", file_type="PDF", file_base64="encoded_string")

    process.add_avo_documentation([doc, doc2])
    process.add_attachments_to_translate([doc, doc2])
    process.add_ancestors_documentation([doc, doc2])
    process.add_translated_documentation([doc, doc2])
    process.add_user_documentation([doc, doc2])

    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved.ancestors_documentation) == 2
    assert len(retrieved.user_documentation) == 2
    assert len(retrieved.attachments_to_translate) == 2
    assert len(retrieved.translated_documentation) == 2
    assert len(retrieved.avo_documentation) == 2
    assert len(retrieved.documentations) == 10
    assert isinstance(retrieved.ancestors_documentation[0], AncestorDocumentation)
    assert isinstance(retrieved.user_documentation[0], UserDocumentation)
    assert isinstance(retrieved.attachments_to_translate[0], AttachmentDocumentation)
    assert isinstance(retrieved.translated_documentation[0], TranslatedDocumentation)
    assert isinstance(retrieved.avo_documentation[0], AvoDocumentation)

    session.delete(retrieved)
    session.commit()

    assert session.query(Process).filter_by(code="PRC123").first() is None
    assert session.query(Documentation).filter_by(name="doc").first() is None
    assert session.query(Documentation).filter_by(name="doc2").first() is None
    assert session.query(AVORequest).filter_by(first_name="John").first() is not None
    assert session.query(Stage).filter_by(description="Load AVO").first() is not None