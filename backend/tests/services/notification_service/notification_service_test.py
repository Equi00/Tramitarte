from datetime import date
import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from services.NotificationService import NotificationService
from entities.TranslationTask import TranslationTask
from enums.Gender import Gender
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
def notification_service(session):
    return NotificationService(session)

def test_generate_alert_to_translator_success(notification_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    notification_service.generate_alert_to_translator(requester.id, translator.id, "New translation request")

    retrieved_notification: Notification = session.query(Notification).filter_by(user_origin_id=requester.id).first()
    retrieved_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert retrieved_notification.description == "New translation request"
    assert retrieved_notification.user_destination == translator
    assert retrieved_translation_request.requester == requester
    assert retrieved_translation_request.translator == translator

def test_generate_alert_to_translator_user_not_found(notification_service):
    with pytest.raises(HTTPException) as exception:
        notification_service.generate_alert_to_translator(3434, 2, "New translation request")
    
    assert exception.value.status_code == 404
    assert "Sender or receiver not found." in exception.value.detail

def test_generate_alert_success(notification_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    notification_service.generate_alert(sender_id=requester.id, receiver_id=translator.id, description="General alert")

    retrieved_notification: Notification = session.query(Notification).filter_by(user_origin_id=requester.id).first()

    assert retrieved_notification.description == "General alert"
    assert retrieved_notification.user_destination == translator

def test_generate_alert_user_not_found(notification_service):
    with pytest.raises(HTTPException) as exception:
        notification_service.generate_alert(1334344, 2, "General alert")
    
    assert exception.value.status_code == 404
    assert "Sender or receiver not found." in exception.value.detail

def test_delete_translation_request_success(notification_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    notification_service.generate_alert_to_translator(requester.id, translator.id, "New translation request")

    retrieved_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    notification_service.delete_translation_request(retrieved_translation_request.id)

    deleted_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert deleted_translation_request is None

def test_delete_translation_request_not_found(notification_service):
    with pytest.raises(HTTPException) as exception:
        notification_service.delete_translation_request(10)
    
    assert exception.value.status_code == 404
    assert "Translation request not found." in exception.value.detail

def test_delete_translation_request_by_requester_success(notification_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()

    notification_service.generate_alert_to_translator(requester.id, translator.id, "New translation request")

    retrieved_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert retrieved_translation_request.requester == requester

    notification_service.delete_translation_request_by_requester(requester_id=requester.id)

    deleted_translation_request: TranslationRequest = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert deleted_translation_request is None

def test_delete_translation_request_by_requester_not_found(notification_service):
    with pytest.raises(HTTPException) as exception:
        notification_service.delete_translation_request_by_requester(34)
    
    assert exception.value.status_code == 404
    assert "Requester not found." in exception.value.detail