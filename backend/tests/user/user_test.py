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

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_user(session):
    user = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.REQUESTER,
        price=100.0,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user)
    session.commit()

    user_db = session.query(User).filter_by(username="Jose55xx").first()

    assert user_db is not None
    assert user_db.name == "Jose"
    assert user_db.surname == "Ramirez"
    assert user_db.role == Role.REQUESTER
    assert user_db.price == 100.0

def test_update_user(session):
    user = User(
        username="jdoe",
        name="John",
        surname="Doe",
        role=Role.TRANSLATOR,
        price=99.99,
        email="jdoe@example.com",
        birthdate=date(1990, 5, 17),
        need_traduction=False,
        photo="profile.jpg"
    )

    session.add(user)
    session.commit()

    update_dto = UpdateUserModel(username="johnny", surname="D", name="Johnny")
    user.update_user(update_dto)
    
    session.commit()

    user_db = session.query(User).filter_by(username="johnny").first()
    assert user_db is not None
    assert user_db.name == "Johnny"
    assert user_db.surname == "D"

def test_unique_email_constraint(session):
    user1 = User(
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

    user2 = User(
        username="user2",
        name="User",
        surname="Two",
        role=Role.REQUESTER,
        price=49.99,
        email="unique@example.com",
        birthdate=date(1995, 3, 25),
        need_traduction=False,
        photo="profile2.jpg"
    )

    session.add(user1)
    session.commit()

    with pytest.raises(Exception): 
        session.add(user2)
        session.commit()