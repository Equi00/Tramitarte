from fastapi import HTTPException
from entities.DownloadRequest import DownloadRequest
from entities.User import User
from entities.Documentation import Documentation
from typing import List


class DownloadRequestService:
    def __init__(self, db):
        self.db = db

    def create_download_request(self, requester_id: int, translator_id: int, documents: List[Documentation]):
        requester = self.db.query(User).filter_by(id=requester_id).first()
        translator = self.db.query(User).filter_by(id=translator_id).first()

        if not requester or not translator:
            raise HTTPException(status_code=404, detail="Requester or translator not found.")

        download_request = DownloadRequest(requester=requester, translator=translator, documentation=documents)

        self.db.add(download_request)
        self.db.commit()

    def find_requests_by_requester(self, requester_id: int) -> List[DownloadRequest]:
        requester = self.db.query(User).filter_by(id=requester_id).first()

        if not requester:
            raise HTTPException(status_code=404, detail="Requester not found.")

        return self.db.query(DownloadRequest).filter_by(requester = requester).first()
