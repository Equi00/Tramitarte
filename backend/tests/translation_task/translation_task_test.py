from entities.TranslationTask import TranslationTask
from enums.Role import Role
from database.Database import Base, SessionLocal, engine
from datetime import date
from entities.Documentation import Documentation
from entities.Process import Process
from entities.Stage import *
from entities.User import User
from entities.DownloadRequest import DownloadRequest
from entities.AVORequest import AVORequest
import pytest
from models.UpdateUserModel import UpdateUserModel

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    stage = Stage1(description="Load AVO")

    db_session.add(stage)
    db_session.commit()

    process = Process(code="PRC123", type="TypeA", descendant_count=2)
    process.stage_id = stage.id

    db_session.add(process)
    db_session.commit()

    translator = User(
        username="user2",
        name="User",
        surname="Two",
        role=Role.TRANSLATOR,
        price=49.99,
        email="unique2@example.com",
        birthdate=date(1995, 3, 25),
        need_traduction=False,
        photo="profile2.jpg"
    )  

    db_session.add(translator)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_translation_task(session):
    translator_db = session.query(User).filter_by(username="user2").first()
    process_db = session.query(Process).filter_by(code="PRC123").first()

    translation_task = TranslationTask(process=process_db, translator=translator_db)
    session.add(translation_task)
    session.commit()


    saved_task = session.query(TranslationTask).filter_by(translator_id=translator_db.id).first()
    
    assert saved_task is not None
    assert saved_task.process_id == process_db.id
    assert saved_task.translator_id == translator_db.id

def test_delete_translation_task(session):
    translator_db = session.query(User).filter_by(username="user2").first()
    process_db = session.query(Process).filter_by(code="PRC123").first()

    translation_task = TranslationTask(process=process_db, translator=translator_db)
    session.add(translation_task)
    session.commit()

    session.delete(translation_task)
    session.commit()

    deleted_task = session.query(TranslationTask).filter_by(process_id=process_db.id).first()
    assert deleted_task is None