from enums.Role import Role
from entities.TranslationRequest import TranslationRequest
from entities.User import User
from datetime import date
from entities.Stage import *
from database.Database import Base, SessionLocal, engine
from entities.Process import Process
from entities.DownloadRequest import DownloadRequest
import pytest

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    requester = User(
        username="user1",
        name="User",
        surname="One",
        role=Role.REQUESTER,
        price=199.99,
        email="unique@example.com",
        birthdate=date(1985, 8, 20),
        need_traduction=False,
        photo="profile1.jpg"
    )

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

    db_session.add(requester)
    db_session.add(translator)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_translation_request(session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="user1").first()

    translation_request = TranslationRequest(translator=translator, requester=requester)
    session.add(translation_request)
    session.commit()

    stored_request = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()
    assert stored_request is not None
    assert stored_request.requester_id == requester.id
    assert stored_request.translator_id == translator.id

def test_translation_request_relationships(session):
    translator = session.query(User).filter_by(username="user2").first()
    requester = session.query(User).filter_by(username="user1").first()

    translation_request = TranslationRequest(requester_id=requester.id, translator_id=translator.id)
    session.add(translation_request)
    session.commit()

    stored_request = session.query(TranslationRequest).filter_by(requester_id=requester.id).first()

    assert stored_request.requester == requester
    assert stored_request.translator == translator

def test_foreign_key_constraint(session):
    invalid_translation_request = TranslationRequest(requester_id=999, translator_id=2)
    
    with pytest.raises(Exception):  
        session.add(invalid_translation_request)
        session.commit()