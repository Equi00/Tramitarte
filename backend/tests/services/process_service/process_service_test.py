from datetime import date
import pytest
from fastapi import HTTPException
from models.DocumentationUpdateModel import DocumentationUpdateModel
from models.AncestorDocumentationModel import AncestorDocumentationModel
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

    stage = Stage1(description="Load AVO")

    process = Process(code="PRC123", user=user, stage=stage)

    db_session.add(process)
    db_session.add(stage)
    db_session.add(user)
    db_session.commit()

    try:
        yield db_session
    finally:
       
        if db_session.is_active:
            db_session.rollback()

        db_session.close()
        
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def process_service(session):
    return ProcessService(session)

def advance_to_stage_2(session, process_service):
    process = session.query(Process).filter_by(code="PRC123").first()

    avo_request = AVORequestModel(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    return process_service.upload_avo(process.id, avo_request)

def advance_to_stage_3(session, process_service):
    process = advance_to_stage_2(session, process_service)

    documents = [
        DocumentationUpdateModel(name="user document", file_type="png", file_base64="dGVzdA=="),
        DocumentationUpdateModel(name="user document 2", file_type="png", file_base64="dGVzdA=="),
        DocumentationUpdateModel(name="user document 3.pdf", file_type="PDF", file_base64="dGVzdA==")
    ]

    return process_service.upload_user_documents(process.id, documents)

def advance_to_stage_4(session, process_service):
    process = advance_to_stage_3(session, process_service)

    documents = [
        DocumentationUpdateModel(name="avo document", file_type="PDF", file_base64="dGVzdA=="),
    ]

    return process_service.upload_avo_documents(process.id, documents)

def advance_to_stage_5(session, process_service):
    process: Process = advance_to_stage_4(session, process_service)

    session.add(process)
    session.commit()
    session.refresh(process)

    documents = [
        DocumentationUpdateModel(name="ancestor document", file_type="PDF", file_base64="dGVzdA=="),
        DocumentationUpdateModel(name="ancestor document", file_type="PDF", file_base64="dGVzdA==")
    ]

    ancestor_document = AncestorDocumentationModel(count=2, documentation=documents)

    return process_service.upload_ancestors_documents(process.id, ancestor_document)

def test_start_process_success(process_service, session):
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

    process = process_service.start_process(user.id)

    retrieved_process = session.query(Process).filter_by(user=user).first()
    assert retrieved_process == process
    assert retrieved_process.user == user
    assert isinstance(retrieved_process.code, str)
    assert retrieved_process.stage.description == "Upload AVO"

def test_start_process_user_not_found(process_service):
    with pytest.raises(HTTPException) as exception:
        process_service.start_process(343434)
    
    assert exception.value.status_code == 404
    assert exception.value.detail == "User not found."

def test_upload_avo(process_service, session):
    process = session.query(Process).filter_by(code="PRC123").first()

    avo_request = AVORequestModel(
        first_name="John",
        last_name="Doe",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    updated_process = process_service.upload_avo(process.id, avo_request)

    retrieved_process = session.query(Process).filter_by(code="PRC123").first()
    assert retrieved_process == updated_process
    assert retrieved_process.request_avo.first_name == avo_request.first_name
    assert retrieved_process.stage.description == "Load User Documentation"

def test_upload_invalid_avo(process_service, session):
    process = session.query(Process).filter_by(code="PRC123").first()

    avo_request = AVORequestModel(
        first_name="",
        last_name="",
        birth_date=date(1990, 1, 1),
        gender=Gender.MALE
    )

    with pytest.raises(InvalidDocumentationException, match="AVO data is invalid"):
        updated_process = process_service.upload_avo(process.id, avo_request)

def test_upload_user_documents_success(process_service, session):
    process = advance_to_stage_2(session, process_service)

    documents = [
        DocumentationUpdateModel(name="user document", file_type="png", file_base64="dGVzdA=="),
        DocumentationUpdateModel(name="user document 2", file_type="png", file_base64="dGVzdA=="),
        DocumentationUpdateModel(name="user document 3.pdf", file_type="PDF", file_base64="dGVzdA==")
    ]

    updated_process = process_service.upload_user_documents(process.id, documents)

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved_process.user_documentation) == 3
    assert len(retrieved_process.attachments_to_translate) == 1
    assert len(retrieved_process.documentations) == 4 # the user documents and the attachments to translate
    assert retrieved_process.code == updated_process.code
    assert retrieved_process.stage.description == "Load AVO Documentation"

def test_upload_user_documents_process_failed(process_service, session):
    process = advance_to_stage_2(session, process_service)

    with pytest.raises(InvalidDocumentationException, match="The user documentation presented is insufficient"):
        process_service.upload_user_documents(process.id, [])

    with pytest.raises(HTTPException) as exception:
        process_service.upload_user_documents(43434, [])

    assert exception.value.status_code == 404
    assert exception.value.detail == "Process not found."

def test_upload_avo_documents_success(process_service, session):
    process = advance_to_stage_3(session, process_service)

    documents = [
        DocumentationUpdateModel(name="avo document", file_type="PDF", file_base64="dGVzdA=="),
    ]

    updated_process = process_service.upload_avo_documents(process.id, documents)

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved_process.avo_documentation) == 1
    assert len(retrieved_process.attachments_to_translate) == 2 # the avo document and the pdf user document
    assert len(retrieved_process.documentations) == 6 # the avo document, the user documents adn the attachments to translate
    assert retrieved_process.code == updated_process.code
    assert retrieved_process.stage.description == "Load Ancestors Documentation"

def test_upload_avo_documents_failed(process_service, session):
    process = advance_to_stage_3(session, process_service)

    documents = []
    
    with pytest.raises(InvalidDocumentationException, match="The AVO documentation presented is insufficient"):
        process_service.upload_avo_documents(process.id, documents)

def test_upload_ancestor_documents_success(process_service, session):
    process: Process = advance_to_stage_4(session, process_service)

    session.add(process)
    session.commit()
    session.refresh(process)

    documents = [
        DocumentationUpdateModel(name="ancestor document", file_type="PDF", file_base64="dGVzdA=="),
        DocumentationUpdateModel(name="ancestor document", file_type="PDF", file_base64="dGVzdA==")
    ]

    ancestor_document = AncestorDocumentationModel(count=2, documentation=documents)

    updated_process = process_service.upload_ancestors_documents(process.id, ancestor_document)

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved_process.ancestors_documentation) == 2
    assert len(retrieved_process.attachments_to_translate) == 4 # the avo document, the pdf user document, the ancestor documents
    assert len(retrieved_process.documentations) == 10 # the avo document(1), the user documents(3), the attachments to translate(4) and the ancestor documents(2)
    assert retrieved_process.code == updated_process.code
    assert retrieved_process.stage.description == "Load Translated Documentation"

def test_upload_ancestor_documents_failed(process_service, session):
    process: Process = advance_to_stage_4(session, process_service)

    process.ancestor_count = 2

    session.add(process)
    session.commit()
    session.refresh(process)

    documents = [
        DocumentationUpdateModel(name="ancestor document", file_type="PDF", file_base64="dGVzdA=="),
    ]

    ancestor_document = AncestorDocumentationModel(count=2, documentation=documents)

    with pytest.raises(InvalidDocumentationException, match="The process is missing necessary ancestor documents"):
        process_service.upload_ancestors_documents(process.id, ancestor_document)

def test_upload_translated_documents_success(process_service, session):
    process: Process = advance_to_stage_5(session, process_service)

    translated_docs = [DocumentationUpdateModel(name=f"translated doc{i}", file_type="PDF", file_base64="encoded") for i in range(len(process.attachments_to_translate))]
    updated_process = process_service.upload_translated_documents(process.id, translated_docs)

    retrieved_process: Process = session.query(Process).filter_by(code="PRC123").first()
    assert len(retrieved_process.translated_documentation) == 4
    assert len(retrieved_process.attachments_to_translate) == 4 # the avo document, the pdf user document, the ancestor documents
    assert len(retrieved_process.documentations) == 14 # the avo document(1), the user documents(3), the attachments to translate(4), the ancestor documents(2), translated documents(4)
    assert retrieved_process.code == updated_process.code
    assert retrieved_process.stage.description == "Process Completed, click to download files"

def test_upload_translated_documents_failed(process_service, session):
    process: Process = advance_to_stage_5(session, process_service)

    translated_docs = [DocumentationUpdateModel(name=f"translated doc{i}", file_type="PDF", file_base64="encoded") for i in range(len(process.attachments_to_translate)-1)]
    
    with pytest.raises(InvalidDocumentationException, match="The process is missing translated documents"):
        process_service.upload_translated_documents(process.id, translated_docs)

def test_get_documents_success(process_service, session):
    process: Process = advance_to_stage_5(session, process_service)

    documents = process_service.get_documents(process.id)

    assert len(documents) == 6

def test_get_documents_process_not_found(process_service):
    with pytest.raises(HTTPException) as exc:
        process_service.get_documents(34343)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Process not found."

def test_delete_process_success(process_service, session):
    process: Process = advance_to_stage_5(session, process_service)

    assert len(session.query(Documentation).filter_by(process_id=process.id).all()) == 10 

    process_service.delete_process(process.id)

    assert session.query(Process).filter_by(code=process.code).first() is None
    assert session.query(Documentation).filter_by(process_id=process.id).all() == []

def test_delete_process_not_found(process_service):
    with pytest.raises(HTTPException) as exc:
        process_service.delete_process(34343)

    assert exc.value.status_code == 404
    assert exc.value.detail == "The process to delete does not exist."

def test_find_by_user_success(process_service, session):
    process: Process = advance_to_stage_5(session, process_service)
    retrieved_user = session.query(User).filter_by(name="Jose").first()

    found_process = process_service.find_by_user(retrieved_user.id)

    assert found_process == process

def test_find_by_user_failed(process_service, session):
    retrieved_user = session.query(User).filter_by(name="asdsdadsaf").first()

    assert process_service.find_by_user(retrieved_user) is None

