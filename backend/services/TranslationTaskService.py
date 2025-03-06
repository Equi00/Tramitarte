from typing import List
from fastapi import HTTPException
from entities.TranslationTask import TranslationTask
from entities.Process import Process
from entities.User import User


class TranslationTaskService:
    def __init__(self, db):
        self.db = db

    def create_translation_task(self, requester_id: int, translator_id: int):
        requester = self.db.query(User).filter_by(id=requester_id).first()
        translator = self.db.query(User).filter_by(id=translator_id).first()

        if not requester:
            raise HTTPException(status_code=404, detail="Requester not found.")
        if not translator:
            raise HTTPException(status_code=404, detail="Translator not found.")

        process = self.db.query(Process).filter_by(user=requester).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found for requester.")

        translation_order = TranslationTask(process=process, translator=translator)

        self.db.add(translation_order)
        self.db.commit()

    def find_by_translator(self, translator_id: int) -> List[TranslationTask]:
        translator = self.db.query(User).filter_by(id=translator_id).first()
        if not translator:
            raise HTTPException(status_code=404, detail="Translator not found.")

        return self.db.query(TranslationTask).filter_by(translator=translator).all()

    def find_by_process(self, process_id: int) -> List[TranslationTask]:
        process = self.db.query(Process).filter_by(id=process_id).first()
        if not process:
            raise HTTPException(status_code=404, detail="Process not found.")

        return self.db.query(TranslationTask).filter_by(process=process).all()

    def delete_by_id(self, id: int):
        translation_task = self.db.query(TranslationTask).filter_by(id=id).first()

        if not translation_task:
            raise HTTPException(status_code=404, detail="Translation task not found.")
        
        self.db.delete(translation_task)
        self.db.commit()