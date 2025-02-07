from datetime import date
import pytest
from fastapi import HTTPException
from unittest.mock import MagicMock
from enums.Gender import Gender
from services.ProcessService import ProcessService
from services.DocumentationService import DocumentationService
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
def documentation_service(session):
    return DocumentationService(session)

def test_save_documentation(documentation_service, session):
    process = session.query(Process).first()
    doc = Documentation(name="test_doc", file_type="pdf", file_base64="dGVzdA==")
    doc.process_id = process.id
    
    saved_doc = documentation_service.save(doc)
    
    retrieved_doc = session.query(Documentation).filter_by(id=saved_doc.id).first()
    assert retrieved_doc.id is not None
    assert retrieved_doc.name == "test_doc"
    assert retrieved_doc.file_base64 == "dGVzdA=="

def test_update_documentation(documentation_service, session):
    process = session.query(Process).first()
    doc = Documentation(name="old", file_type="pdf", file_base64="b2xkZGF0YQ==")
    doc.process_id = process.id

    doc = documentation_service.save(doc)

    updated_doc = Documentation(name="new", file_type="jpg", file_base64="bmV3ZGF0YQ==")
    
    documentation_service.update(doc.id, updated_doc)

    updated_record = session.query(Documentation).filter_by(id = doc.id).first()
    assert updated_record.file_type == "jpg"
    assert updated_record.name == "new"
    assert updated_record.file_base64 == "bmV3ZGF0YQ=="

def test_update_documentation_not_found(documentation_service, session):
    with pytest.raises(HTTPException) as exception:
        process = session.query(Process).first()
        updated_doc = Documentation(name="new", file_type="jpg", file_base64="bWlzc2luZw==")
        updated_doc.process_id = process.id
        documentation_service.update(doc_id=999, updated_doc=updated_doc)
    
    assert exception.value.status_code == 404
    assert exception.value.detail == "Documentation not found."