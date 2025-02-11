import pytest
from main import app
from fastapi.testclient import TestClient
from datetime import date
from fastapi import HTTPException
from unittest.mock import MagicMock
from models.DocumentationModel import DocumentationModel
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



client = TestClient(app)

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

def test_create_download_request_success(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    process = session.query(Process).filter_by(code="PRC123").first()
    json_documents = [
        {
            "id": 0,
            "name": "Test Document",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]

    response = client.post(f"/api/download-request/requester/{requester.id}/translator/{translator.id}", json=json_documents)

    retrieved_download_request = session.query(DownloadRequest).filter_by(requester_id=requester.id).first()
    
    assert response.status_code == 200
    assert retrieved_download_request is not None
    assert retrieved_download_request.requester == requester
    assert retrieved_download_request.translator == translator
    assert len(retrieved_download_request.documentation) == 1
    assert retrieved_download_request.documentation[0].name == json_documents[0]["name"]

def test_create_download_request_requester_not_found(session):
    json_documents = [
        {
            "id": 0,
            "name": "Test Document",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
            "process_id": 545
        }
    ]
    response = client.post(f"/api/download-request/requester/{454}/translator/{4543}", json=json_documents)

    assert response.status_code == 404
    assert response.json() == {"detail": "Requester or translator not found."}

def test_find_requests_by_requester_success(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    json_documents = [
        {
            "name": "Test Document",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
        }
    ]

    response = client.post(f"/api/download-request/requester/{requester.id}/translator/{translator.id}", json=json_documents)

    result = client.get(f"/api/download-request/requester/{requester.id}")

    assert response.status_code == 200
    assert result.status_code == 200
    assert result.json()[0]["requester_id"] == requester.id
    assert result.json()[0]["translator_id"] == translator.id 
    assert result.json()[0]["documentation"][0] == json_documents[0] 

def test_find_requests_by_requester_not_found(session):
    response = client.get(f"/api/download-request/requester/{343434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Requester not found."}

def test_delete_download_request_by_id(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    json_documents = [
        {
            "name": "Test Document",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
        }
    ]

    client.post(f"/api/download-request/requester/{requester.id}/translator/{translator.id}", json=json_documents)

    retrieved_download_request: DownloadRequest = session.query(DownloadRequest).filter_by(requester_id=requester.id).first()

    assert retrieved_download_request.documentation[0].name == json_documents[0]["name"]

    response = client.delete(f"/api/download-request/{requester.id}")

    deleted_download_request = session.query(DownloadRequest).filter_by(requester_id=requester.id).first()

    assert deleted_download_request is None
    assert response.status_code == 200
    assert response.json() == {"message": "Download request deleted successfully"}

def test_delete_download_request_by_id_failed(session):
    response = client.delete(f"/api/download-request/{3434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Request not found."}