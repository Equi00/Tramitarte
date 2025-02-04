from database.Test_database import TestingBase, TestingSessionLocal, testing_engine
from avo_request_test_entity import AVORequestTest
import pytest
from enums.Gender import Gender
from datetime import date

@pytest.fixture(scope="function")
def session():
    """Create a clean session for each test."""

    TestingBase.metadata.create_all(bind=testing_engine)
    db_session = TestingSessionLocal()

    yield db_session

    db_session.rollback()
    db_session.close()
    TestingBase.metadata.drop_all(bind=testing_engine)


def test_is_valid_with_valid_data(session):
    avo_request = AVORequestTest(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() == True

def test_is_valid_with_invalid_first_name(session):
    avo_request = AVORequestTest(
        first_name="",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() == False

def test_is_valid_with_invalid_last_name(session):
    avo_request = AVORequestTest(
        first_name="John",
        last_name="",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() == False

def test_is_valid_with_invalid_birth_date(session):
    avo_request = AVORequestTest(
        first_name="John",
        last_name="Doe",
        birth_date=date(2100, 1, 1),  # Invalid future birth date
        gender=Gender.MALE
    )

    session.add(avo_request)
    session.commit()

    assert avo_request.is_valid() == False

def test_is_valid_with_valid_data_for_gender(session):
    male_avo_request = AVORequestTest(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )
    female_avo_request = AVORequestTest(
        first_name="Jane",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.FEMALE
    )
        
    session.add(male_avo_request)
    session.add(female_avo_request)
    session.commit()

    assert male_avo_request.is_valid() == True
    assert female_avo_request.is_valid() == True