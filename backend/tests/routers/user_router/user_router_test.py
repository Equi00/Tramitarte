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
from main import app
from fastapi.testclient import TestClient



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
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    db_session.add(user)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

def test_create_user(session):
    new_user = {
        "username": "string",
        "name": "string",
        "surname": "string",
        "role": "TRANSLATOR",
        "email": "user@example.com",
        "birthdate": "2025-02-08",
        "need_traduction": True,
        "photo": "string"
        }
    response = client.post("/api/user/", json=new_user)

    retrieved_user = session.query(User).filter_by(username="string").first()
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == retrieved_user.email

    session.delete(session.query(User).filter_by(username="string").first())
    session.commit()