from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session
from models.UpdateAVORequestModel import UpdateAVORequestModel
from models.ProcessModel import ProcessModel
from models.StageModel import StageModel
from models.DocumentationUpdateModel import DocumentationUpdateModel
from models.DocumentationModel import DocumentationModel
from models.AVORequestModel import AVORequestModel
from database.Database import SessionLocal
from services.ProcessService import ProcessService
from services.AVORequestService import AVORequestService
from services.DocumentationService import DocumentationService
from services.UserService import UserService

p_router = APIRouter(prefix="/api/process", tags=["Process"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_process_service(db: db_dependency):
    return ProcessService(db)

def get_avo_service(db: db_dependency):
    return AVORequestService(db)

def get_documentation_service(db: db_dependency):
    return DocumentationService(db)

def get_user_service(db: db_dependency):
    return UserService(db)

@p_router.get("/user/{user_id}", response_model=Optional[ProcessModel])
async def get_process_by_user(user_id: int, service: ProcessService = Depends(get_process_service)):
    try:
        return service.find_by_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.post("/{user_id}", response_model=ProcessModel)
async def start_process(user_id: int, service: ProcessService = Depends(get_process_service)):
    try:
        return service.start_process(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.post("/upload-avo/{process_id}", response_model=AVORequestModel)
async def upload_avo(
    process_id: int, 
    request: AVORequestModel, 
    process_service: ProcessService = Depends(get_process_service)):
    try:
        process_service.upload_avo(process_id, request)
        return request
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.post("/upload/documentation/user/{user_id}")
async def upload_user_documentation(user_id: int, documentation: List[DocumentationModel], service: ProcessService = Depends(get_process_service)) -> dict:
    try:
        service.upload_user_documents(user_id, documentation)
        return {"message": "Documentation successfully saved"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.post("/upload/documentation/avo/{process_id}")
async def upload_avo_documentation(process_id: int, documentation: List[DocumentationModel], service: ProcessService = Depends(get_process_service)) -> dict:
    service.upload_avo_documents(process_id, documentation)
    return {"message": "Documentation successfully saved"}
    


@p_router.post("/upload/documentation/ancestors/{process_id}")
async def upload_ancestors_documentation(process_id: int, documentation: List[DocumentationModel], service: ProcessService = Depends(get_process_service)) -> dict:
    try:
        service.upload_ancestors_documents(process_id, documentation)
        return {"message": "Documentation successfully saved"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.post("/upload/documentation/translated/{user_id}", response_model=ProcessModel)
async def upload_translated_documentation(user_id: int, documentation: List[DocumentationModel], service: ProcessService = Depends(get_process_service)):
    try:
        return service.upload_translated_documents(user_id, documentation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.get("/documentation/{process_id}", response_model=List[DocumentationModel])
async def get_documentation(process_id: int, service: ProcessService = Depends(get_process_service)):
    try:
        return service.get_documents(process_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.post("/modify/document/{document_id}")
async def modify_document(document_id: int, document: DocumentationUpdateModel, service: DocumentationService = Depends(get_documentation_service)) -> dict:
    try:
        service.update(document_id, document)
        return {"message": "Documentation successfully saved"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.delete("/{process_id}")
async def delete_process(process_id: int, service: ProcessService = Depends(get_process_service)) -> dict:
    try:
        service.delete_process(process_id)
        return {"message": "Process successfully deleted"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@p_router.get("/request/user/{user_id}", response_model=Optional[UpdateAVORequestModel])
async def get_avo_request_by_user(user_id: int, user_service: UserService = Depends(get_user_service), avo_service: AVORequestService = Depends(get_avo_service)):
    try:
        user = user_service.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return avo_service.find_avo_by_user(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))