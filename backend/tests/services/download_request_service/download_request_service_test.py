from datetime import date
import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from services.DownloadRequestService import DownloadRequestService
from enums.Gender import Gender
from services.ProcessService import ProcessService
from entities.User import User
from entities.Notification import Notification
from entities.TranslationRequest import TranslationRequest
from entities.Process import Process
from models.NotificationModel import NotificationModel
from models.UpdateUserModel import UpdateUserModel
from entities.Documentation import *
from entities.DownloadRequest import DownloadRequest
from entities.Stage import *
from entities.AVORequest import AVORequest
from enums.Role import Role
from database.Database import Base, SessionLocal, engine

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    user = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.REQUESTER,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    user2 = User(
        username="user2",
        name="user2",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="asdfasfd@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    stage = Stage1(description="Load AVO")

    process = Process(code="PRC123", user=user, stage=stage)

    db_session.add(process)
    db_session.add(stage)
    db_session.add(user2)
    db_session.add(user)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def download_request_service(session):
    return DownloadRequestService(session)

def test_create_download_request_success(download_request_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    process = session.query(Process).filter_by(code="PRC123").first()
    documents = [UserDocumentation(name="Test Document", file_type="PDF", file_base64="dGVzdA==", process_id=process.id)]

    download_request_service.create_download_request(requester.id, translator.id, documents)

    retrieved_download_request = session.query(DownloadRequest).filter_by(requester_id=requester.id).first()
    assert retrieved_download_request is not None
    assert retrieved_download_request.requester == requester
    assert retrieved_download_request.translator == translator
    assert len(retrieved_download_request.documentation) == 1
    assert retrieved_download_request.documentation[0] == documents[0]

def test_create_download_request_requester_not_found(download_request_service, session):
    translator = session.query(User).filter_by(username="user2").first()
    with pytest.raises(HTTPException) as exc:
        download_request_service.create_download_request(545, translator.id, [])

    assert exc.value.status_code == 404
    assert exc.value.detail == "Requester or translator not found."  

def test_create_download_request_translator_not_found(download_request_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    with pytest.raises(HTTPException) as exception:
        download_request_service.create_download_request(requester.id, 3434, [])

    assert exception.value.status_code == 404
    assert exception.value.detail == "Requester or translator not found."

def test_find_requests_by_requester_success(download_request_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    process = session.query(Process).filter_by(code="PRC123").first()
    documents = [UserDocumentation(name="Test Document", file_type="PDF", file_base64="dGVzdA==", process_id=process.id)]

    download_request_service.create_download_request(requester.id, translator.id, documents)

    result = download_request_service.find_requests_by_requester(requester.id)

    assert result.requester == requester
    assert result.translator == translator


def test_find_requests_by_requester_not_found(download_request_service, session):
    with pytest.raises(HTTPException) as exception:
        download_request_service.find_requests_by_requester(565665)

    assert exception.value.status_code == 404
    assert exception.value.detail == "Requester not found."