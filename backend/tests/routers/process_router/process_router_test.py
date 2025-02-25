import pytest
from main import app
from fastapi.testclient import TestClient
from datetime import date
from fastapi import HTTPException
from models.DocumentationModel import DocumentationModel
from models.AVORequestModel import AVORequestModel
from enums.Gender import Gender
from services.ProcessService import ProcessService
from entities.User import User
from entities.Notification import Notification
from entities.TranslationRequest import TranslationRequest
from entities.Process import Process
from models.NotificationModel import NotificationModel
from models.UpdateUserModel import UpdateUserModel
from entities.Documentation import *
from entities.DownloadRequest import DownloadRequest
from entities.Stage import *
from entities.AVORequest import AVORequest
from enums.Role import Role
from database.Database import Base, SessionLocal, engine

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

    user2 = User(
        username="user2",
        name="asdasdf",
        surname="asdfsdf",
        role = Role.TRANSLATOR,
        email="asdfasdsdf@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    stage = Stage1(description="Load AVO")

    process = Process(code="PRC123", user=user, stage=stage)

    db_session.add(process)
    db_session.add(stage)
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

def advance_to_stage_2(session):
    process = session.query(Process).filter_by(code="PRC123").first()

    json_avo = {
        "id": 0,
        "first_name": "avo name",
        "last_name": "Doe",
        "birth_date": "2025-02-08",
        "gender": "Male"
    }

    client.post(f"/api/process/upload-avo/{process.id}", json=json_avo)

    # expire session to obtain actual data
    session.expire_all()

    return session.query(Process).filter_by(code="PRC123").first()

def advance_to_stage_3(session):
    process = advance_to_stage_2(session)

    json_documents = [
        {
            "id": 0,
            "name": "user document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 1,
            "name": "user document 2",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 2,
            "name": "user document 3",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]

    client.post(f"/api/process/upload/documentation/user/{process.user.id}", json=json_documents)

    # expire session to obtain actual data
    session.expire_all() 

    return session.query(Process).filter_by(code="PRC123").first()

def advance_to_stage_4(session):
    process = advance_to_stage_3(session)

    json_documents = [
        {
            "id": 3,
            "name": "avo document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]

    client.post(f"/api/process/upload/documentation/avo/{process.user.id}", json=json_documents)

    # expire session to obtain actual data
    session.expire_all()

    return session.query(Process).filter_by(code="PRC123").first()

def advance_to_stage_5(session):
    process: Process = advance_to_stage_4(session)

    process.ancestor_count = 2

    session.add(process)
    session.commit()
    session.refresh(process)

    json_documents = {
        "count": 2,
        "documentation": [{
            "id": 4,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 5,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }]
    }

    client.post(f"/api/process/upload/documentation/ancestors/{process.user.id}", json=json_documents)

    # expire session to obtain actual data
    session.expire_all()

    return session.query(Process).filter_by(code="PRC123").first()

def test_start_process_success(session):
    user = User(
        username="asdfasfd",
        name="asdfasdf",
        surname="asdfasdf",
        role = Role.TRANSLATOR,
        email="another@gmail.com",
        birthdate=date(1990, 5, 14),
        need_traduction=False,
        photo="photo.png"
    )

    session.add(user)
    session.commit()

    response = client.post(f"/api/process/{user.id}")

    retrieved_process = session.query(Process).filter_by(user=user).first()

    assert response.status_code == 200
    assert retrieved_process.user == user
    assert isinstance(retrieved_process.code, str)
    assert retrieved_process.stage.description == "Upload AVO"

def test_start_process_user_not_found(session):
    response = client.post(f"/api/process/{45455}")   

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

def test_upload_avo(session):
    process = session.query(Process).filter_by(code="PRC123").first()

    json_avo = {
        "id": 0,
        "first_name": "John",
        "last_name": "Doe",
        "birth_date": "2025-02-08",
        "gender": "Male"
    }

    response = client.post(f"/api/process/upload-avo/{process.id}", json=json_avo)

    # expire session to obtain actual data
    session.expire_all()

    retrieved_process = session.query(Process).filter_by(code="PRC123").first()

    assert response.status_code == 200
    assert retrieved_process.id == process.id
    assert retrieved_process.request_avo is not None
    assert retrieved_process.request_avo.first_name == json_avo["first_name"]
    assert retrieved_process.stage.description == "Load User Documentation"

def test_upload_invalid_avo(session):
    process = session.query(Process).filter_by(code="PRC123").first()

    json_avo = {
        "id": 0,
        "first_name": "",
        "last_name": "",
        "birth_date": "2025-02-08",
        "gender": "Male"
    }

    with pytest.raises(InvalidDocumentationException, match="AVO data is invalid"):
        client.post(f"/api/process/upload-avo/{process.id}", json=json_avo)

def test_upload_avo_failed(session):
    json_avo = {
        "id": 0,
        "first_name": "",
        "last_name": "",
        "birth_date": "2025-02-08",
        "gender": "Male"
    }

    response = client.post(f"/api/process/upload-avo/{3434}", json=json_avo)  

    assert response.status_code == 404
    assert response.json() == {"detail": "Process not found."}

def test_upload_user_documents_success(session):
    process = advance_to_stage_2(session)

    json_documents = [
        {
            "id": 0,
            "name": "user document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 1,
            "name": "user document 2",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 2,
            "name": "user document 3",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]

    response = client.post(f"/api/process/upload/documentation/user/{process.user.id}", json=json_documents) 

    # expire session to obtain actual data
    session.expire_all()

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()

    assert response.status_code == 200
    assert response.json() == {"message": "Documentation successfully saved"}
    assert len(retrieved_process.user_documentation) == 3
    assert len(retrieved_process.attachments_to_translate) == 1
    assert len(retrieved_process.documentations) == 4 # the user documents and the attachments to translate
    assert retrieved_process.code == process.code
    assert retrieved_process.stage.description == "Load AVO Documentation"

def test_upload_user_documents_process_failed(session):
    process = advance_to_stage_2(session)

    json_documents = [
        {
            "id": 0,
            "name": "user document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]

    with pytest.raises(InvalidDocumentationException, match="The user documentation presented is insufficient"):
        client.post(f"/api/process/upload/documentation/user/{process.user.id}", json=json_documents)

    response = client.post(f"/api/process/upload/documentation/user/{343434}", json=json_documents)

    assert response.status_code == 404
    assert response.json() == {"detail": "Process not found."}

def test_upload_avo_documents_success(session):
    process = advance_to_stage_3(session)

    json_documents = [
        {
            "id": 3,
            "name": "avo document",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]

    response = client.post(f"/api/process/upload/documentation/avo/{process.id}", json=json_documents)

    # expire session to obtain actual data
    session.expire_all()

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()

    assert response.status_code == 200
    assert response.json() == {"message": "Documentation successfully saved"}
    assert len(retrieved_process.avo_documentation) == 1
    assert len(retrieved_process.attachments_to_translate) == 2 # the avo document and the pdf user document
    assert len(retrieved_process.documentations) == 6 # the avo document, the user documents adn the attachments to translate
    assert retrieved_process.code == process.code
    assert retrieved_process.stage.description == "Load Ancestors Documentation"

def test_upload_avo_documents_insufficient(session):
    process = advance_to_stage_3(session)

    json_documents = []
    
    with pytest.raises(InvalidDocumentationException, match="The AVO documentation presented is insufficient"):
        client.post(f"/api/process/upload/documentation/avo/{process.id}", json=json_documents)

def test_upload_avo_documents_failed(session):
    process = advance_to_stage_3(session)

    json_documents = [
        {
            "id": 3,
            "name": "avo document",
            "file_type": "PDF",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }
    ]
    
    response = client.post(f"/api/process/upload/documentation/avo/{343434}", json=json_documents)

    assert response.status_code == 404
    assert response.json() == {"detail": "Process not found."}

def test_upload_ancestors_documents_success(session):
    process: Process = advance_to_stage_4(session)

    session.add(process)
    session.commit()
    session.refresh(process)

    json_documents = {
        "count": 2,
        "documentation": [{
            "id": 4,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 5,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }]
    }

    response = client.post(f"/api/process/upload/documentation/ancestors/{process.id}", json=json_documents)

    # expire session to obtain actual data
    session.expire_all()

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()

    assert response.status_code == 200
    assert response.json() == {"message": "Documentation successfully saved"}
    assert len(retrieved_process.ancestors_documentation) == 2
    assert len(retrieved_process.attachments_to_translate) == 4 # the avo document, the pdf user document, the ancestor documents
    assert len(retrieved_process.documentations) == 10 # the avo document(1), the user documents(3), the attachments to translate(4) and the ancestor documents(2)
    assert retrieved_process.code == process.code
    assert retrieved_process.stage.description == "Load Translated Documentation"

def test_upload_ancestor_documents_insufficient(session):
    process: Process = advance_to_stage_4(session)

    session.add(process)
    session.commit()
    session.refresh(process)

    json_documents = {
        "count": 2,
        "documentation": [{
            "id": 4,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }]
    }

    with pytest.raises(InvalidDocumentationException, match="The process is missing necessary ancestor documents"):
        client.post(f"/api/process/upload/documentation/ancestors/{process.id}", json=json_documents)

def test_upload_ancestor_documents_failed(session):
    process = advance_to_stage_3(session)

    json_documents = {
        "count": 2,
        "documentation": [{
            "id": 4,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        },
        {
            "id": 5,
            "name": "ancestor document",
            "file_type": "png",
            "file_base64": "dGVzdA==",
            "process_id": process.id
        }]
    }
    
    response = client.post(f"/api/process/upload/documentation/ancestors/{343434}", json=json_documents)

    assert response.status_code == 404
    assert response.json() == {"detail": "Process not found."}

def test_upload_translated_documents_success(session):
    process: Process = advance_to_stage_5(session)

    translated_docs = [
        {
            "id": 6 + i,
            "name": f"translated doc{i}",
            "file_type": "PDF",
            "file_base64": "encoded",
            "process_id": process.id
        }
        for i in range(len(process.attachments_to_translate))
    ]    

    response = client.post(f"/api/process/upload/documentation/translated/{process.user.id}", json=translated_docs)

    # expire session to obtain actual data
    session.expire_all()

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()

    assert response.status_code == 200
    assert response.json()["code"] == retrieved_process.code
    assert len(retrieved_process.translated_documentation) == 4
    assert len(retrieved_process.attachments_to_translate) == 4 # the avo document, the pdf user document, the ancestor documents
    assert len(retrieved_process.documentations) == 14 # the avo document(1), the user documents(3), the attachments to translate(4), the ancestors documents(2), translated documents(4)
    assert retrieved_process.code == process.code
    assert retrieved_process.stage.description == "Process Completed, click to download files"

def test_upload_translated_documents_insufficient(session):
    process: Process = advance_to_stage_5(session)

    translated_docs = [
            {
                "id": 6 + i,
                "name": f"translated doc{i}",
                "file_type": "PDF",
                "file_base64": "encoded",
                "process_id": process.id
            }
            for i in range(len(process.attachments_to_translate)-1)
        ]     
    
    with pytest.raises(InvalidDocumentationException, match="The process is missing translated documents"):
        client.post(f"/api/process/upload/documentation/translated/{process.id}", json=translated_docs)

def test_upload_translated_documents_failed(session):
    process: Process = advance_to_stage_5(session)

    translated_docs = [
            {
                "id": 6 + i,
                "name": f"translated doc{i}",
                "file_type": "PDF",
                "file_base64": "encoded",
                "process_id": process.id
            }
            for i in range(len(process.attachments_to_translate)-1)
        ]     
    
    response = client.post(f"/api/process/upload/documentation/translated/{33434}", json=translated_docs)

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

def test_get_documents_success(session):
    process: Process = advance_to_stage_5(session)

    response = client.get(f"/api/process/documentation/{process.id}")

    assert response.status_code == 200
    assert len(response.json()) == 10

def test_get_documents_process_not_found(session):
    response = client.get(f"/api/process/documentation/{4333434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Process not found."}

def test_delete_process_success(session):
    process: Process = advance_to_stage_5(session)

    assert len(session.query(Documentation).filter_by(process_id=process.id).all()) == 10 

    response = client.delete(f"/api/process/{process.id}")

    assert response.status_code == 200
    assert response.json() == {"message": "Process successfully deleted"}

    assert session.query(Process).filter_by(code=process.code).first() is None
    assert session.query(Documentation).filter_by(process_id=process.id).all() == []

def test_delete_process_not_found(session):
    response = client.delete(f"/api/process/{343443}")

    assert response.status_code == 404
    assert response.json() == {"detail": "The process to delete does not exist."}

def test_find_by_user_success(session):
    process: Process = advance_to_stage_5(session)

    response = client.get(f"/api/process/user/{process.user.id}")

    assert response.status_code == 200
    assert response.json()["code"] == process.code

def test_find_by_user_failed(session):
    response = client.get(f"/api/process/user/{343443}")

    assert response.status_code == 200
    assert response.json() is None

def test_modify_doc(session):
    process: Process = advance_to_stage_5(session)

    document = process.avo_documentation[0]

    updated_document = {
                "name": f"UPDATED DOC",
                "file_type": "PDF",
                "file_base64": "asdsdasadfasdfsdaf",
            }
    
    response = client.put(f"/api/process/modify/document/{document.id}", json=updated_document)

    # expire session to obtain actual data
    session.expire_all()

    retrieved_process = session.query(Process).filter_by(code="PRC123").first()

    assert response.status_code == 200
    assert response.json() == {"message": "Documentation successfully saved"}

    assert retrieved_process.avo_documentation[0].name == "UPDATED DOC"

def test_modify_doc_failed(session):
    updated_document = {
                "name": f"UPDATED DOC",
                "file_type": "PDF",
                "file_base64": "asdsdasadfasdfsdaf",
            }
    
    response = client.put(f"/api/process/modify/document/{343434}", json=updated_document)

    assert response.status_code == 404
    assert response.json() == {"detail": "Documentation not found."}

def test_get_avo_by_user(session):
    process: Process = advance_to_stage_5(session)
    
    response = client.get(f"/api/process/request/user/{process.user.id}")

    assert response.status_code == 200
    assert response.json()["first_name"] == "avo name"

def test_get_avo_by_user_null_value(session):    
    user = session.query(User).filter_by(username="user2").first()
    response = client.get(f"/api/process/request/user/{user.id}")

    assert response.status_code == 200
    assert response.json() == None

def test_get_avo_by_user_failed(session):    
    response = client.get(f"/api/process/request/user/{343434}")

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found."}

def test_update_avo(session):
    process: Process = advance_to_stage_2(session)

    assert process.request_avo.last_name == "Doe"

    json_avo = {
        "id": process.request_avo.id,
        "first_name": "Luigi",
        "last_name": "Buco",
        "birth_date": "1995-02-08",
        "gender": "Male"
    }

    response = client.put(f"/api/process/avo", json=json_avo)

    # expire session to obtain actual data
    session.expire_all()

    assert response.status_code == 200
    assert response.json() == {"message": "AVO updated successfully"}
    assert process.request_avo.last_name == "Buco"

def test_update_avo_failed(session):
    process: Process = advance_to_stage_2(session)

    json_avo = {
        "id": process.request_avo.id,
        "first_name": "Luigi",
        "last_name": "Buco",
        "birth_date": "3000-02-08",
        "gender": "Male"
    }

    response = client.put(f"/api/process/avo", json=json_avo)

    # expire session to obtain actual data
    session.expire_all()

    assert response.status_code == 400
    assert response.json() == {"detail": "AVO is not valid."}

def test_update_avo_not_found(session):
    json_avo = {
        "id": 0,
        "first_name": "Luigi",
        "last_name": "Buco",
        "birth_date": "1995-02-08",
        "gender": "Male"
    }

    response = client.put(f"/api/process/avo", json=json_avo)

    assert response.status_code == 404
    assert response.json() == {"detail": "The AVO to modify does not exist."}