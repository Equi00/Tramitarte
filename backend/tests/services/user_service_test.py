from datetime import date
import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from enums.NType import NType
from services.UserService import UserService
from entities.User import User
from entities.Notification import Notification
from entities.TranslationRequest import TranslationRequest
from entities.Process import Process
from models.NotificationModel import NotificationModel
from models.UpdateUserModel import UpdateUserModel
from entities.Documentation import Documentation
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

    translator = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    requester = User(
        username="Jose55xx",
        name="Jose2",
        surname="Ramirez",
        role = Role.REQUESTER,
        email="asdfasd@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    db_session.add(translator)
    db_session.add(requester)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def user_service(session):
    return UserService(session)

def test_create_user(user_service, session):
    user = User(
        username="asdsdf",
        name="ramiro",
        surname="asdfsadf",
        role = Role.REQUESTER,
        email="aaaaaa@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    created_user = user_service.create(user)

    retrieved_user = session.query(User).filter_by(name="ramiro").first()
    assert retrieved_user is not None
    assert retrieved_user is created_user
    assert retrieved_user.name == "ramiro"

def test_find_translators(user_service, session):
    retrieved_translator = session.query(User).filter_by(name="Jose").first()
    retrieved_requester = session.query(User).filter_by(name="Jose2").first()

    translators = user_service.find_translators()
    
    assert len(translators) == 1
    assert translators[0] is not retrieved_requester
    assert translators[0] is retrieved_translator

def test_find_by_role(user_service, session):
    retrieved_translator = session.query(User).filter_by(name="Jose").first()
    retrieved_requester = session.query(User).filter_by(name="Jose2").first()

    result = user_service.find_by_role(Role.REQUESTER)
    
    assert len(result) == 1
    assert result[0] is retrieved_requester
    assert result[0] is not retrieved_translator

def test_find_by_id(user_service, session):
    retrieved_requester = session.query(User).filter_by(name="Jose2").first()

    found_user = user_service.find_by_id(retrieved_requester.id)
    
    assert found_user is not None
    assert found_user is retrieved_requester

def test_find_by_email(user_service, session):
    retrieved_requester = session.query(User).filter_by(name="Jose2").first()

    found_user = user_service.find_by_email("asdfasd@gmail.com")
    
    assert found_user is not None
    assert found_user is retrieved_requester
    assert found_user.email == retrieved_requester.email

def test_find_by_email_not_found(user_service):
    with pytest.raises(HTTPException) as exception:
        user_service.find_by_email("notfound@example.com")
    
    assert exception.value.status_code == 404
    assert "No registered user with this email" in exception.value.detail

def test_find_notifications_by_user_destination_id(user_service, session):
    retrieved_translator = session.query(User).filter_by(name="Jose").first()
    retrieved_requester = session.query(User).filter_by(name="Jose2").first()

    notification = Notification(
        user_origin=retrieved_translator,
        user_destination=retrieved_requester,
        description="Test Notification",
        notification_type=NType.NOTIFICATION
    )
    session.add(notification)
    session.commit()

    notifications = user_service.find_notifications_by_user_destination_id(retrieved_requester.id)
    
    assert len(notifications) == 1
    assert notifications[0].description == "Test Notification"

def test_find_notifications_user_not_found(user_service):
    with pytest.raises(HTTPException) as exception:
        user_service.find_notifications_by_user_destination_id(99)
    
    assert exception.value.status_code == 404
    assert "User not found" in exception.value.detail

def test_update_user(user_service, session):
    retrieved_requester = session.query(User).filter_by(name="Jose2").first()

    update_data = UpdateUserModel(name="Updated User")
    updated_user = user_service.update(retrieved_requester.id, update_data)
    
    assert updated_user.name == "Updated User"
    assert updated_user.email == retrieved_requester.email

def test_update_user_not_found(user_service):
    update_data = UpdateUserModel(name="Updated Name")
    
    with pytest.raises(HTTPException) as exception:
        user_service.update(99, update_data)
    
    assert exception.value.status_code == 404
    assert "User not found" in exception.value.detail

def test_validate_email_format_valid(user_service):
    try:
        user_service.validate_email_format("test@example.com")
    except HTTPException:
        pytest.fail("Validation should not raise an exception.")

def test_validate_email_format_invalid(user_service):
    with pytest.raises(HTTPException) as exception:
        user_service.validate_email_format("invalid-email")

    assert exception.value.status_code == 400
    assert "Invalid email format" in exception.value.detail
