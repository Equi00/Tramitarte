from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated, List
from sqlalchemy.orm import Session
from models.DocumentationUpdateModel import DocumentationUpdateModel
from models.DownloadRequestModel import DownloadRequestModel
from models.DocumentationModel import DocumentationModel
from entities.Documentation import Documentation
from entities.DownloadRequest import DownloadRequest
from database.Database import SessionLocal
from services.DownloadRequestService import DownloadRequestService

dr_router = APIRouter(
    prefix="/api/download-request",
    tags=["Download Request"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def get_download_request_service(db: db_dependency):
    return DownloadRequestService(db)


@dr_router.get("/requester/{requester_id}")
async def get_download_requests_by_requester(
    requester_id: int,
    service: DownloadRequestService = Depends(get_download_request_service)
) -> List[DownloadRequestModel]:
    return service.find_requests_by_requester(requester_id)


@dr_router.post("/requester/{requester_id}/translator/{translator_id}")
async def create_download_request(
    requester_id: int,
    translator_id: int,
    documents: List[DocumentationUpdateModel],
    service: DownloadRequestService = Depends(get_download_request_service)
):
    return service.create_download_request(requester_id, translator_id, documents)


@dr_router.delete("/{request_id}")
async def delete_download_request(
    request_id: int,
    service: DownloadRequestService = Depends(get_download_request_service)
) -> dict:
    return service.delete_download_request_by_id(request_id)
