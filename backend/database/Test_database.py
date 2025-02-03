from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_TEST_DATABASE = "postgresql://postgres:postgres@localhost:5432/TramitarteAppTest"

testing_engine = create_engine(URL_TEST_DATABASE)

TestingSessionLocal = sessionmaker(autoflush=False, bind=testing_engine)

TestingBase = declarative_base()