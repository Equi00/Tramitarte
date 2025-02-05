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

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_documentation(session):
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", type="TypeA", descendant_count=2)

    process.stage_id = stage.id

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
    stage = Stage1(description="Load AVO")

    session.add(stage)

    session.commit()

    process = Process(code="PRC123", type="TypeA", descendant_count=2)

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