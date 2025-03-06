from entities.Notification import Notification
from enums.Role import Role
from database.Database import Base, SessionLocal, engine
from datetime import date
from entities.Documentation import Documentation
from entities.Process import Process
from entities.DownloadRequest import DownloadRequest
from entities.Stage import *
from entities.User import User
from entities.AVORequest import AVORequest
import pytest
from models.UpdateUserModel import UpdateUserModel

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
        surname="user2",
        role = Role.TRANSLATOR,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    db_session.add(user)
    db_session.add(user2)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_notification(session):
    user1 = session.query(User).filter_by(username="Jose55xx").first()
    user2 = session.query(User).filter_by(username="user2").first()

    notification = Notification(
        user_origin=user1,
        user_destination=user2,
        description="Test Notification",
    )

    session.add(notification)
    session.commit()
    
    retrieved = session.query(Notification).filter_by(user_origin_id=user1.id).first()
    assert retrieved is not None
    assert retrieved.description == "Test Notification"
    assert retrieved.user_origin_id == user1.id
    assert retrieved.user_destination_id == user2.id

def test_invalid_notification(session):
    user1 = session.query(User).filter_by(username="Jose55xx").first()
    user2 = session.query(User).filter_by(username="user2").first()

    with pytest.raises(Exception):
        notification = Notification(
            user_destination=user2,
            description="Test Alert",
        )   
        session.add(notification)
        session.commit()

    with pytest.raises(Exception):
        notification = Notification(
            user_origin=user2,
            description="Test Alert",
        )   
        session.add(notification)
        session.commit()

    with pytest.raises(Exception):
        notification = Notification(
            user_origin=user1,
            user_destination=user2,
        )   
        session.add(notification)
        session.commit()

    with pytest.raises(Exception):
        notification = Notification(
            user_origin=user1,
            user_destination=user2,
            description="Test Alert",
        )   
        session.add(notification)
        session.commit()