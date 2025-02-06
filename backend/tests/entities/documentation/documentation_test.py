from datetime import date
from enums.Role import Role
from entities.Documentation import *
from entities.Process import Process
from entities.Stage import *
from entities.User import User
from entities.DownloadRequest import DownloadRequest
from entities.AVORequest import AVORequest
import pytest
from database.Database import Base, SessionLocal, engine


@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    user1 = User(
        username="user1",
        name="User",
        surname="One",
        role=Role.REQUESTER,
        email="unique@example.com",
        birthdate=date(1985, 8, 20),
        need_traduction=False,
        photo="profile1.jpg"
    )

    db_session.add(user1)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_documentation(session):
    user = session.query(User).filter_by(username="user1").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    session.add(process)
    session.commit()

    doc = UserDocumentation(name="Test Document", file_type="PDF", file_base64="dGVzdA==")

    doc.process_id = process.id

    session.add(doc)
    session.commit()
    
    retrieved_doc = session.query(Documentation).filter_by(name="Test Document").first()
    
    assert retrieved_doc is not None
    assert retrieved_doc.name == "Test Document"
    assert retrieved_doc.file_type == "PDF"
    assert retrieved_doc.file_base64 == "dGVzdA=="
    assert isinstance(retrieved_doc, UserDocumentation)

def test_missing_fields(session):
    user = session.query(User).filter_by(username="user1").first()
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", user=user, stage=stage)

    process.stage_id = stage.id

    session.add(process)
    session.commit()

    with pytest.raises(Exception):
        doc = UserDocumentation(name=None, file_type="PDF", file_base64="dGVzdA==")
        doc.process_id = process.id
        session.add(doc)
        session.commit()
    
    with pytest.raises(Exception):
        doc = AvoDocumentation(name="Test", file_type=None, file_base64="dGVzdA==")
        doc.process_id = process.id
        session.add(doc)
        session.commit()
    
    with pytest.raises(Exception):
        doc = DescendantDocumentation(name="Test", file_type="PDF", file_base64=None)
        doc.process_id = process.id
        session.add(doc)
        session.commit()

    with pytest.raises(Exception):
        doc = TranslatedDocumentation(name="Test", file_type="PDF", file_base64=None)
        doc.process_id = process.id
        session.add(doc)
        session.commit()

    with pytest.raises(Exception):
        doc = AttachmentDocumentation(name="Test", file_type="PDF", file_base64=None)
        session.add(doc)
        session.commit()