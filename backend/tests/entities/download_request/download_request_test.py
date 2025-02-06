from datetime import date
from entities.DownloadRequest import DownloadRequest
from entities.Documentation import UserDocumentation
from enums.Role import Role
from entities.User import User
from entities.Stage import *
from database.Database import Base, SessionLocal, engine
from entities.Process import Process
import pytest

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    requester = User(
        username="user1",
        name="User",
        surname="One",
        role=Role.REQUESTER,
        email="unique@example.com",
        birthdate=date(1985, 8, 20),
        need_traduction=False,
        photo="profile1.jpg"
    )

    translator = User(
        username="user2",
        name="User",
        surname="Two",
        role=Role.TRANSLATOR,
        email="unique2@example.com",
        birthdate=date(1995, 3, 25),
        need_traduction=False,
        photo="profile2.jpg"
    )

    db_session.add(requester)
    db_session.add(translator)
    db_session.commit()

    stage = Stage1(description="Load AVO")

    db_session.add(stage)
    db_session.commit()

    process = Process(code="PRC123", user=requester, stage=stage)

    db_session.add(process)
    db_session.commit()

    doc1 = UserDocumentation(name="Test Doc1", file_type="pdf", file_base64="some_base64")
    doc2 = UserDocumentation(name="Test Doc2", file_type="pdf", file_base64="some_base64")
    doc1.process_id = process.id
    doc2.process_id = process.id

    db_session.add(doc1)
    db_session.add(doc2)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_download_request(session):
    requester = session.query(User).filter_by(username="user1").first()
    translator = session.query(User).filter_by(username="user2").first()
    document = session.query(UserDocumentation).filter_by(name="Test Doc1").first()

    download_request = DownloadRequest(requester=requester, translator=translator, documentation=[document])
    session.add(download_request)
    session.commit()

    retrieved_download_request = session.query(DownloadRequest).filter_by(requester_id=requester.id).first()
    assert retrieved_download_request.id is not None
    assert retrieved_download_request.requester == requester
    assert retrieved_download_request.translator == translator
    assert len(retrieved_download_request.documentation) == 1 

def test_associate_documents_to_download_request(session):
    document1 = session.query(UserDocumentation).filter_by(name="Test Doc1").first()
    document2 = session.query(UserDocumentation).filter_by(name="Test Doc2").first()
    requester = session.query(User).filter_by(username="user1").first()
    translator = session.query(User).filter_by(username="user2").first()

    download_request = DownloadRequest(requester=requester, translator=translator)
    session.add(download_request)
    session.commit()

    retrieved_download_request = session.query(DownloadRequest).filter_by(requester_id=requester.id).first()

    retrieved_download_request.documentation.append(document1)
    retrieved_download_request.documentation.append(document2)
    session.commit()

    assert len(retrieved_download_request.documentation) == 2
    assert document1 in retrieved_download_request.documentation
    assert document2 in retrieved_download_request.documentation

    assert document1.download_request == download_request
    assert document2.download_request == download_request

def test_delete_download_request(session):
    requester = session.query(User).filter_by(username="user1").first()
    translator = session.query(User).filter_by(username="user2").first()
    document1 = session.query(UserDocumentation).filter_by(name="Test Doc1").first()

    download_request = DownloadRequest(requester=requester, translator=translator)
    download_request.documentation.append(document1)
    session.add(download_request)
    session.commit()

    assert len(download_request.documentation) == 1

    session.delete(download_request)
    session.commit()

    assert session.query(DownloadRequest).filter_by(requester_id=requester.id).first() is None
    assert document1.download_request is None

def test_orphaned_documentation(session):
    requester = session.query(User).filter_by(username="user1").first()
    translator = session.query(User).filter_by(username="user2").first()
    document1 = session.query(UserDocumentation).filter_by(name="Test Doc1").first()

    assert document1.download_request is None

    download_request = DownloadRequest(requester=requester, translator=translator)
    download_request.documentation.append(document1)
    session.add(download_request)
    session.commit()

    assert document1.download_request == download_request

def test_download_request_without_documents(session):
    requester = session.query(User).filter_by(username="user1").first()
    translator = session.query(User).filter_by(username="user2").first()

    download_request = DownloadRequest(requester=requester, translator=translator)
    session.add(download_request)
    session.commit()

    assert len(download_request.documentation) == 0