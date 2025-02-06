from database.Database import Base, SessionLocal, engine

def get_db():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()