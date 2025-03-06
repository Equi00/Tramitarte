from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# For docker image excecution
URL_DATABASE = "postgresql://postgres:postgres@db:5432/TramitarteApp"

# For local excecution
#URL_DATABASE = "postgresql://postgres:postgres@localhost:5432/TramitarteApp"

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autoflush=False, bind=engine)

Base = declarative_base()