from datetime import date
import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from entities.TranslationTask import TranslationTask
from services.TranslationTaskService import TranslationTaskService
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
def translation_task_service(session):
    return TranslationTaskService(session)

def test_create_translation_task_success(translation_task_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    process = session.query(Process).filter_by(code="PRC123").first()

    translation_task_service.create_translation_task(requester_id=requester.id, translator_id=translator.id)

    retrieved_task = session.query(TranslationTask).filter_by(translator_id = translator.id).first()

    assert retrieved_task is not None
    assert retrieved_task.process == process

def test_create_translation_task_requester_not_found(translation_task_service, session):
    translator = session.query(User).filter_by(username="user2").first()

    with pytest.raises(HTTPException) as exception:
        translation_task_service.create_translation_task(requester_id=3434, translator_id=translator.id)

    assert exception.value.status_code == 404
    assert exception.value.detail == "Requester not found."

def test_create_translation_task_translator_not_found(translation_task_service, session):
    requester = session.query(User).filter_by(username="Jose55xx").first()

    with pytest.raises(HTTPException) as exception:
        translation_task_service.create_translation_task(requester_id=requester.id, translator_id=34344)

    assert exception.value.status_code == 404
    assert exception.value.detail == "Translator not found."


def test_create_translation_task_process_not_found(translation_task_service, session):
    requester = User(
        username="asdfd",
        name="asdfa",
        surname="asdf",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )
    session.add(requester)
    session.commit()
    translator = session.query(User).filter_by(username="user2").first()

    with pytest.raises(HTTPException) as exception:
        translation_task_service.create_translation_task(requester_id=requester.id, translator_id=translator.id)

    assert exception.value.status_code == 404
    assert exception.value.detail == "Process not found for requester."

def test_find_by_translator_success(translation_task_service, session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="Jose55xx").first()

    translation_task_service.create_translation_task(requester_id=requester.id, translator_id=translator.id)
    translation_task_service.create_translation_task(requester_id=requester.id, translator_id=translator.id)

    result = translation_task_service.find_by_translator(translator_id=translator.id)

    assert len(result) == 2
    assert result[0].translator == translator


def test_find_by_translator_not_found(translation_task_service):
    with pytest.raises(HTTPException) as exception:
        translation_task_service.find_by_translator(translator_id=34344)

    assert exception.value.status_code == 404
    assert exception.value.detail == "Translator not found."


def test_find_by_process_success(translation_task_service, session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="Jose55xx").first()
    process = session.query(Process).filter_by(code="PRC123").first()

    translation_task_service.create_translation_task(requester_id=requester.id, translator_id=translator.id)

    result = translation_task_service.find_by_process(process_id=process.id)

    assert result[0].translator == translator
    assert result[0].process == process


def test_find_by_process_not_found(translation_task_service):
    with pytest.raises(HTTPException) as excepiton:
        translation_task_service.find_by_process(process_id=10)

    assert excepiton.value.status_code == 404
    assert excepiton.value.detail == "Process not found."

def test_delete_by_id(translation_task_service, session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="Jose55xx").first()
    process = session.query(Process).filter_by(code="PRC123").first()

    translation_task_service.create_translation_task(requester_id=requester.id, translator_id=translator.id)

    result = translation_task_service.find_by_process(process_id=process.id)

    translation_task_service.delete_by_id(result[0].id)

    translation_task_retrieved = session.query(TranslationTask).filter_by(translator_id=translator.id).first()

    assert translation_task_retrieved is None


def test_delete_by_id_failed(translation_task_service):
    with pytest.raises(HTTPException) as excepiton:
        translation_task_service.delete_by_id(34344)

    assert excepiton.value.status_code == 404
    assert excepiton.value.detail == "Translation task not found."