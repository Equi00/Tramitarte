from entities.TranslationRequest import TranslationRequest
from entities.Notification import Notification
from enums.Role import Role
from database.Database import Base, SessionLocal, engine
from datetime import date
from entities.Documentation import Documentation
from entities.Process import Process
from entities.DownloadRequest import DownloadRequest
from entities.Stage import *
from entities.User import User
import pytest
from main import app
from fastapi.testclient import TestClient



client = TestClient(app)

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

def test_get_translators(session):
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

    session.add(user)
    session.commit()

    response = client.get("/api/user/translators")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    data = response.json()
    assert data[0]["email"] == "jramirez@gmail.com"

def test_get_translators_null_value(session):
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

    session.add(user)
    session.commit()

    response = client.get("/api/user/translators")
    assert response.status_code == 200
    assert response.json() == []

def test_get_requesters(session):
    user1 = User(
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
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()

    response = client.get(f"/api/user/requesters")
    assert response.status_code == 200
    assert response.json()[0]["email"] == user2.email
    assert len(response.json()) == 1

def test_get_notification(session):
    user1 = User(
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
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()

    notification = Notification(user_origin=user1, user_destination=user2, description="notification to asdfsadf")

    session.add(notification)
    session.commit()

    response = client.get(f"/api/user/{user2.id}/notifications")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert response.json() == [{"id": notification.id, "user_origin_id": user1.id, "user_destination_id": user2.id, "description": "notification to asdfsadf"}]

def test_get_notification_null_value(session):
    user1 = User(
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
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()

    response = client.get(f"/api/user/{user2.id}/notifications")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert response.json() == []

def test_get_notification_failed(session):
    response = client.get(f"/api/user/{3434}/notifications")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

def test_update_user(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.REQUESTER,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user1)
    session.commit()

    update = {
        "username": "string",
        "surname": "string",
        "name": "string"
    }

    update2 = {
        "username": "asdfasdfasdfasfddf",
    }

    response = client.put(f"/api/user/{user1.id}", json=update)
    assert response.status_code == 200
    assert response.json()["username"] == "string"
    assert response.json()["email"] == "jramirez@gmail.com"

    response = client.put(f"/api/user/{user1.id}", json=update2)
    assert response.status_code == 200
    assert response.json()["username"] == "asdfasdfasdfasfddf"

def test_update_user_failed(session):
    update = {
        "username": "string",
        "surname": "string",
        "name": "string"
    }

    response = client.put(f"/api/user/{3434434}", json=update)
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

def test_get_user_by_id(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.REQUESTER,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user1)
    session.commit()

    response = client.get(f"/api/user/{user1.id}")
    assert response.status_code == 200
    assert response.json()["email"] == user1.email

def test_get_user_by_id_failed(session):
    response = client.get(f"/api/user/{34343434}")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

def test_get_user_by_email(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.REQUESTER,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user1)
    session.commit()

    response = client.get(f"/api/user/?email={user1.email}")
    assert response.status_code == 200
    assert response.json()["surname"] == "Ramirez"

def test_get_user_by_email_failed(session):
    response = client.get(f"/api/user/?email=asdf@gmail.com")
    assert response.status_code == 404
    assert response.json() == {"detail": "No registered user with this email."}

def test_get_user_by_invalid_email(session):
    response = client.get(f"/api/user/?email=asdfgmail.com")
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid email format. It should be in the form name@domain.extension"}

def test_get_translation_requests(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    user2 = User(
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()

    translation_request = TranslationRequest(requester=user2, translator=user1)

    session.add(translation_request)
    session.commit()

    response = client.get(f"/api/user/{user1.id}/translation-requests")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_get_translation_requests_failed(session):
    response = client.get(f"/api/user/{454545}/translation-requests")
    assert response.status_code == 404
    assert response.json() == {"detail": "Translator not found."}

def test_get_translation_requests_null_value(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user1)
    session.commit()

    response = client.get(f"/api/user/{user1.id}/translation-requests")
    assert response.status_code == 200
    assert response.json() == []

def test_get_translation_requests_by_requester_and_translator(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    user2 = User(
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()

    translation_request1 = TranslationRequest(requester=user2, translator=user1)
    translation_request2 = TranslationRequest(requester=user2, translator=user1)

    session.add(translation_request1)
    session.add(translation_request2)
    session.commit()
    
    response = client.get(f"/api/user/translation-requests/requester/{user2.id}/translator/{user1.id}")
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_get_translation_requests_by_requester_and_translator_null_value(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    user2 = User(
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()
    
    response = client.get(f"/api/user/translation-requests/requester/{user2.id}/translator/{user1.id}")
    assert response.status_code == 200
    assert response.json() == []

def test_get_translation_requests_by_requester_and_translator_failed(session):
    response = client.get(f"/api/user/translation-requests/requester/{34543554}/translator/{454545}")
    assert response.status_code == 404
    assert response.json() == {"detail":"User(s) not found."}

def test_find_request_by_requester(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    user2 = User(
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()

    translation_request = TranslationRequest(requester=user2, translator=user1)

    session.add(translation_request)
    session.commit()
    
    response = client.get(f"/api/user/requests/requester/{user2.id}")
    assert response.status_code == 200
    assert response.json()["translator_id"] == user1.id

def test_find_request_by_requester_null_value(session):
    user1 = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.TRANSLATOR,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    user2 = User(
        username="asdfasdf",
        name="asdfd",
        surname="asdfasfd",
        role = Role.REQUESTER,
        email="asdfasdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=True,
        photo="photo.png"
    )

    session.add(user1)
    session.add(user2)
    session.commit()
    
    response = client.get(f"/api/user/requests/requester/{user2.id}")
    assert response.status_code == 200
    assert response.json() == None

def test_find_request_by_requester_failed(session):
    response = client.get(f"/api/user/requests/requester/{445445}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Requester not found."}

def test_get_translator_by_email(session):
    user2 = User(
        username="asdfasdf",
        name="asdfasd",
        surname="asdfasdf",
        role = Role.TRANSLATOR,
        email="asdfasd@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user2)
    session.commit()

    response = client.get(f"/api/user/translator/email?email={user2.email}")
    assert response.status_code == 200
    assert response.json()["surname"] == "asdfasdf"

def test_get_translator_by_email_null_value(session):
    response = client.get(f"/api/user/translator/email?email=examples@gmail.com")
    assert response.status_code == 200
    assert response.json() == None

def test_get_translator_by_email_failed(session):
    response = client.get(f"/api/user/translator/email?email=examplesgmail.com")
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid email format. It should be in the form name@domain.extension"}

def test_delete_user(session):
    user2 = User(
        username="asdfasdf",
        name="asdfasd",
        surname="asdfasdf",
        role = Role.TRANSLATOR,
        email="asdfasd@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user2)
    session.commit()

    response = client.delete(f"/api/user/{user2.id}")
    assert response.status_code == 200
    assert response.json()["email"] == user2.email

def test_delete_user_failed(session):
    response = client.delete(f"/api/user/{343434}")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}