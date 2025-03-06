from datetime import date
import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from models.UpdateAVORequestModel import UpdateAVORequestModel
from models.AVORequestModel import AVORequestModel
from services.AVORequestService import AVORequestService
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

    stage = Stage1(description="Load AVO")

    process = Process(code="PRC123", user=user1, stage=stage)

    db_session.add(process)
    db_session.add(stage)
    db_session.add(user1)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def avo_request_service(session):
    return AVORequestService(session)

def test_save_valid_avo_request(avo_request_service, session):
    avo_request = AVORequestModel(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    result = avo_request_service.save(avo_request)

    retrieved_avo = session.query(AVORequest).filter_by(first_name="John").first()
    assert retrieved_avo == result

def test_save_invalid_avo_request(avo_request_service):
    avo_request = AVORequestModel(
        first_name="",
        last_name="",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    with pytest.raises(HTTPException) as exc_info:
        avo_request_service.save(avo_request)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "AVO is not valid."

def test_update_existing_avo_request(avo_request_service, session):
    avo_request = AVORequestModel(
        first_name="asdf",
        last_name="asdf",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    result = avo_request_service.save(avo_request)

    avo_request = UpdateAVORequestModel(
        id = result.id,
        first_name="JOSE"
    )

    updated_avo = avo_request_service.update(avo_request)

    retrieved_avo = session.query(AVORequest).filter_by(first_name="JOSE").first()

    assert updated_avo == retrieved_avo
    assert retrieved_avo.first_name == "JOSE"
    assert retrieved_avo.id == updated_avo.id == result.id == avo_request.id

def test_update_non_existent_avo_request(avo_request_service):
    avo_request = UpdateAVORequestModel(
        id = 0,
        first_name="asdf",
        last_name="asdf",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    with pytest.raises(HTTPException) as exception:
        avo_request_service.update(avo_request)

    assert exception.value.status_code == 404
    assert exception.value.detail == "The AVO to modify does not exist."

def test_find_avo_by_user_existing(avo_request_service, session):
    retireved_process = session.query(Process).filter_by(code="PRC123").first()

    result = avo_request_service.find_avo_by_user(retireved_process.user)

    assert result == retireved_process.request_avo

def test_find_avo_by_user_not_found(avo_request_service, session):
    user1 = session.query(User).filter_by(username="user1").first()

    result = avo_request_service.find_avo_by_user(user1)

    assert result is None