import pytest
from main import app
from fastapi.testclient import TestClient
from datetime import date
from fastapi import HTTPException
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

def test_create_translation_task_success(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()
    translator = session.query(User).filter_by(username="user2").first()
    process = session.query(Process).filter_by(code="PRC123").first()

    response = client.post(f"/api/task/requester/{requester.id}/translator/{translator.id}")

    retrieved_task = session.query(TranslationTask).filter_by(translator_id = translator.id).first()

    assert response.status_code == 200
    assert retrieved_task is not None
    assert retrieved_task.process == process

def test_create_translation_task_requester_not_found(session):
    translator = session.query(User).filter_by(username="user2").first()

    response = client.post(f"/api/task/requester/{43434}/translator/{translator.id}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Requester not found."}

def test_create_translation_task_translator_not_found(session):
    requester = session.query(User).filter_by(username="Jose55xx").first()

    response = client.post(f"/api/task/requester/{requester.id}/translator/{343434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Translator not found."}

def test_find_by_translator_success(session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="Jose55xx").first()

    client.post(f"/api/task/requester/{requester.id}/translator/{translator.id}")
    client.post(f"/api/task/requester/{requester.id}/translator/{translator.id}")

    response = client.get(f"/api/task/translator/{translator.id}")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["translator_id"] == translator.id


def test_find_by_translator_not_found(session):
    response = client.get(f"/api/task/translator/{343434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Translator not found."}

def test_find_by_process_success(session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="Jose55xx").first()
    process = session.query(Process).filter_by(code="PRC123").first()

    client.post(f"/api/task/requester/{requester.id}/translator/{translator.id}")

    response = client.get(f"/api/task/process/{process.id}")

    assert response.status_code == 200
    assert response.json()[0]["translator_id"] == translator.id
    assert response.json()[0]["process"]["id"] == process.id


def test_find_by_process_not_found(session):
    response = client.get(f"/api/task/process/{43434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Process not found."}

def test_delete_by_id(session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="Jose55xx").first()
    process = session.query(Process).filter_by(code="PRC123").first()

    client.post(f"/api/task/requester/{requester.id}/translator/{translator.id}")

    translation_task = client.get(f"/api/task/process/{process.id}")

    response = client.delete(f"/api/task/{translation_task.json()[0]["id"]}")

    translation_task_retrieved = session.query(TranslationTask).filter_by(translator_id=translator.id).first()

    assert response.status_code == 200
    assert response.json() == {"message": "Request successfully deleted"}
    assert translation_task_retrieved is None


def test_delete_by_id_failed(session):
    response = client.delete(f"/api/task/{1221}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Translation task not found."}