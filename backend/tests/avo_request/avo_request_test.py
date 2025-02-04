from database.Database import Base, SessionLocal, engine
from entities.Documentation import Documentation
from entities.Process import Process
from entities.Stage import *
from entities.User import User
from entities.AVORequest import AVORequest
import pytest
from enums.Gender import Gender
from datetime import date

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""

    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()

    yield db_session

    db_session.rollback()
    db_session.close()
    Base.metadata.drop_all(bind=engine)


def test_is_valid_with_valid_data(session):
    avo_request = AVORequest(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() is True

def test_is_valid_with_invalid_first_name(session):
    avo_request = AVORequest(
        first_name="",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() is False

def test_is_valid_with_invalid_last_name(session):
    avo_request = AVORequest(
        first_name="John",
        last_name="",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() == False

def test_is_valid_with_invalid_birth_date(session):
    avo_request = AVORequest(
        first_name="John",
        last_name="Doe",
        birth_date=date(2100, 1, 1),  # Invalid future birth date
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() is False

def test_is_valid_with_valid_data_for_gender(session):
    male_avo_request = AVORequest(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )
    female_avo_request = AVORequest(
        first_name="Jane",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.FEMALE
    )
        
    session.add(male_avo_request)
    session.add(female_avo_request)
    session.commit()

    assert male_avo_request.is_valid() is True
    assert female_avo_request.is_valid() is True