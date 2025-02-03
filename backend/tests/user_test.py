from enums.Role import Role
from database.Test_database import TestingBase, TestingSessionLocal, testing_engine
from entities.User import User
from datetime import date
import pytest 

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""

    TestingBase.metadata.create_all(bind=testing_engine)
    db_session = TestingSessionLocal()

    yield db_session

    db_session.rollback()
    db_session.close()
    TestingBase.metadata.drop_all(bind=testing_engine)

def test_create_user():
    user = User(
        username="Jose55xx",
        name="Jose",
        surname="Ramirez",
        role = Role.APPLICANT,
        price=100.0,
        email="jramirez@gmail.com",
        birthdate=date(1990, 5, 14),
        photo="photo.png"
    )

    session.add(user)
    session.commit()

    user_db = session.query(User).filter_by(username="Jose55xx").first()

    assert user_db is not None
    assert user_db.name == "Jose"
    assert user_db.surname == "Ramirez"
    assert user_db.role == Role.APPLICANT
    assert user_db.price == 100.0