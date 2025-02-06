from enums.Role import Role
from entities.AVORequest import AVORequest
from entities.User import User
from entities.Documentation import *
from enums.Gender import Gender
from entities.DownloadRequest import DownloadRequest
from datetime import date
from entities.Stage import *
from database.Database import Base, SessionLocal, engine
from entities.Process import Process
from exceptions.InvalidDocumentationException import InvalidDocumentationException
import pytest


@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    avo_request = AVORequest(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    invalid_avo_request = AVORequest(
        first_name="invalid",
        last_name="Doe",
        birth_date=date(2222, 1, 1),
        gender=Gender.MALE
    )

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
    db_session.add(avo_request)
    db_session.add(invalid_avo_request)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)


def test_stage1_to_stage2(session):
    avo_request = session.query(AVORequest).filter_by(first_name="John").first()
    user = session.query(User).filter_by(name="John").first()

    stage1 = Stage1(description="Load AVO")
    process = Process(code="PRC001", stage=stage1, user=user)

    process.assign_avo_request(avo_request)

    session.add(stage1)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()
    retrieved.advance_stage()

    assert isinstance(process.stage, Stage2)
    assert process.stage.description == "Load User Documentation"

def test_stage1_fails_with_invalid_avo(session):
    stage1 = Stage1(description="Load AVO")
    avo_request = session.query(AVORequest).filter_by(first_name="invalid").first()
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage1, user=user)
    process.assign_avo_request(avo_request)

    session.add(stage1)
    session.add(process)
    session.commit()

    with pytest.raises(InvalidDocumentationException, match="AVO data is invalid"):
        retrieved = session.query(Process).filter_by(code="PRC001").first()
        retrieved.advance_stage()

def test_stage2_to_stage3(session):
    stage2 = Stage2(description="Load User Documentation")
    user = session.query(User).filter_by(name="John").first()
    process = Process(code="PRC001", stage=stage2, user=user)

    docs = [UserDocumentation(name=f"doc{i}", file_type="PDF", file_base64="encoded") for i in range(3)]
    process.add_user_documentation(docs)

    session.add(stage2)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    retrieved.advance_stage()

    assert isinstance(retrieved.stage, Stage3)
    assert retrieved.stage.description == "Load AVO Documentation"

def test_stage2_fails_with_insufficient_user_docs(session):
    stage2 = Stage2(description="Load User Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage2, user=user)

    docs = [UserDocumentation(name="doc1", file_type="PDF", file_base64="encoded")]
    process.add_user_documentation(docs)

    session.add(stage2)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    with pytest.raises(InvalidDocumentationException, match="The user documentation presented is insufficient"):
        retrieved.advance_stage()

def test_stage3_to_stage4(session):
    stage3 = Stage3(description="Load AVO Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage3, user=user)

    avo_docs = [AvoDocumentation(name="avo_doc", file_type="PDF", file_base64="encoded")]
    process.add_avo_documentation(avo_docs)

    session.add(stage3)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    retrieved.advance_stage()

    assert isinstance(retrieved.stage, Stage4)
    assert retrieved.stage.description == "Load Descendant Documentation"

def test_stage3_fails_without_avo_docs(session):
    stage3 = Stage3(description="Load AVO Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage3, user=user)

    session.add(stage3)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    with pytest.raises(InvalidDocumentationException, match="The AVO documentation presented is insufficient"):
        retrieved.advance_stage()

def test_stage4_to_stage5(session):
    stage4 = Stage4(description="Load Descendant Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage4, user=user)

    descendant_docs = [DescendantDocumentation(name="desc_doc", file_type="PDF", file_base64="encoded")]
    process.descendant_documentation.extend(descendant_docs)

    session.add(stage4)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    retrieved.advance_stage()

    assert isinstance(retrieved.stage, Stage5)
    assert retrieved.stage.description == "Load Translated Documentation"

def test_stage4_fails_without_descendant_docs(session):
    stage4 = Stage4(description="Load Descendant Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage4, user=user)

    session.add(stage4)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    with pytest.raises(InvalidDocumentationException, match="The process is missing necessary descendant documents"):
        retrieved.advance_stage()

def test_stage5_completion(session):
    stage5 = Stage5(description="Load Translated Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage5, user=user)

    docs = [UserDocumentation(name="doc", file_type="PDF", file_base64="encoded")]
    process.add_attachments_to_translate(docs)
    process.add_translated_documentation(docs)

    session.add(stage5)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    retrieved.advance_stage()

    assert isinstance(retrieved.stage, Stage5)
    assert retrieved.stage.description == "Process Completed, click to download files"

def test_stage5_fails_without_translated_docs(session):
    stage5 = Stage5(description="Load Translated Documentation")
    user = session.query(User).filter_by(name="John").first()

    process = Process(code="PRC001", stage=stage5, user=user)

    docs = [UserDocumentation(name="doc", file_type="PDF", file_base64="encoded")]
    process.add_attachments_to_translate(docs)

    session.add(stage5)
    session.add(process)
    session.commit()

    retrieved = session.query(Process).filter_by(code="PRC001").first()

    with pytest.raises(InvalidDocumentationException, match="The process is missing translated documents"):
        retrieved.advance_stage()