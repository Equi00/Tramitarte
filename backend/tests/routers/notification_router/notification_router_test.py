from fastapi import HTTPException
from entities.TranslationRequest import TranslationRequest
from entities.Notification import Notification
from enums.Role import Role
from database.Database import Base, SessionLocal, engine
from datetime import date
from entities.Documentation import Documentation
from entities.Process import Process
from entities.DownloadRequest import DownloadRequest
from entities.Stage import *
from entities.User import User
import pytest
from main import app
from fastapi.testclient import TestClient



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

def test_get_notifications(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    notification = Notification(
        user_origin=requester,
        user_destination=translator,
        description="Test Notification",
    )

    session.add(notification)
    session.commit()

    response = client.get(f"/api/notification/{translator.id}")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["description"] == "Test Notification"

def test_get_notifications_null_value(session):
    translator = session.query(User).filter_by(username="user2").first()

    response = client.get(f"/api/notification/{translator.id}")

    assert response.status_code == 200
    assert response.json() == []

def test_get_notifications_failed(session):
    response = client.get(f"/api/notification/{34344334}")   

    assert response.status_code == 404
    assert response.json() == {"detail": "Receiver not found."}

def test_create_alert_to_translator(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    
    response = client.post(f"/api/notification/alert-translator/{requester.id}/{translator.id}", params={"description": "Translation needed"})

    retrieved_notification: Notification = session.query(Notification).filter_by(user_origin_id=requester.id).first()
    retrieved_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert response.status_code == 200
    assert retrieved_notification.description == "Translation needed"
    assert retrieved_notification.user_destination == translator
    assert retrieved_translation_request.requester == requester
    assert retrieved_translation_request.translator == translator

def test_create_alert_to_translator_failed(session):
    response = client.post(f"/api/notification/alert-translator/{43434}/{34344}", params={"description": "Translation needed"})
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Sender or receiver not found."}

def test_create_alert(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    response = client.post(f"/api/notification/alert/{requester.id}/{translator.id}", params={"description": "Translation needed"})

    retrieved_notification: Notification = session.query(Notification).filter_by(user_origin_id=requester.id).first()

    assert response.status_code == 200
    assert retrieved_notification.description == "Translation needed"
    assert retrieved_notification.user_destination == translator

def test_generate_alert_user_not_found(session):
    response = client.post(f"/api/notification/alert/{3434}/{343434}", params={"description": "Translation needed"})  

    assert response.status_code == 404
    assert response.json() == {"detail": "Sender or receiver not found."}

def test_delete_alert(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    client.post(f"/api/notification/alert/{requester.id}/{translator.id}", params={"description": "Translation needed"})

    retrieved_notification: Notification = session.query(Notification).filter_by(user_origin_id=requester.id).first()

    response = client.delete(f"/api/notification/alert/{retrieved_notification.id}")

    deleted_notification: Notification = session.query(Notification).filter_by(user_origin_id=requester.id).first()

    assert response.status_code == 200
    assert response.json()["id"] == retrieved_notification.id
    assert deleted_notification is None

def test_delete_alert_failed(session):
    response = client.delete(f"/api/notification/alert/{343434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Notification not found."}

def test_delete_translation_request(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    
    client.post(f"/api/notification/alert-translator/{requester.id}/{translator.id}", params={"description": "Translation needed"})

    retrieved_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    response = client.delete(f"/api/notification/request/{retrieved_translation_request.id}")

    deleted_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert deleted_translation_request is None
    assert response.status_code == 200

def test_delete_translation_request_failed(session):
    response = client.delete(f"/api/notification/request/{545455}")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Translation request not found."}

def test_delete_translation_request_by_requester(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    client.post(f"/api/notification/alert-translator/{requester.id}/{translator.id}", params={"description": "Translation needed"})

    response = client.delete(f"/api/notification/request/requester/{requester.id}")
    
    deleted_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    retrieved_notification: Notification = session.query(Notification).filter_by(description=f"The requester {requester.email} has deleted their request.").first()

    assert response.status_code == 200
    assert retrieved_notification is not None
    assert retrieved_notification.description == f"The requester {requester.email} has deleted their request."
    assert deleted_translation_request is None

def test_delete_translation_request_by_requester_failed(session):
    response = client.delete(f"/api/notification/request/requester/{454545}")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "Requester not found."}
