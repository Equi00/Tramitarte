from fastapi import HTTPException
from entities.User import User
from entities.TranslationRequest import TranslationRequest
from entities.Notification import Notification


class NotificationService:
    def __init__(self, db):
        self.db = db

    def find_all_notifications_by_user_destination(self, user_receiver_id: int):
        receiver = self.db.query(User).filter_by(id=user_receiver_id).first()

        if not receiver:
            raise HTTPException(status_code=404, detail="Receiver not found.")
        
        return self.db.query(Notification).filter_by(user_destination_id = receiver.id).all()

    def generate_alert_to_translator(self, sender_id: int, receiver_id: int, description: str):
        sender = self.db.query(User).filter_by(id=sender_id).first()
        receiver = self.db.query(User).filter_by(id=receiver_id).first()

        if not sender or not receiver:
            raise HTTPException(status_code=404, detail="Sender or receiver not found.")

        new_alert = Notification(user_origin=sender, user_destination=receiver, description=description)
        translation_request = TranslationRequest(requester=sender, translator=receiver)

        self.db.add(translation_request)
        self.db.add(new_alert)
        self.db.commit()

    def generate_alert(self, sender_id: int, receiver_id: int, description: str):
        sender = self.db.query(User).filter_by(id=sender_id).first()
        receiver = self.db.query(User).filter_by(id=receiver_id).first()

        if not sender or not receiver:
            raise HTTPException(status_code=404, detail="Sender or receiver not found.")

        new_alert = Notification(user_origin=sender, user_destination=receiver, description=description)
        
        self.db.add(new_alert)
        self.db.commit()

    def delete_translation_request(self, request_id: int):
        translation_request = self.db.query(TranslationRequest).filter_by(id=request_id).first()

        if not translation_request:
            raise HTTPException(status_code=404, detail="Translation request not found.")

        self.db.delete(translation_request)
        self.db.commit()

    def delete_translation_request_by_requester(self, requester_id: int):
        requester = self.db.query(User).filter_by(id=requester_id).first()

        if not requester:
            raise HTTPException(status_code=404, detail="Requester not found.")

        translation_request = self.db.query(TranslationRequest).filter_by(requester=requester).first()

        if translation_request and translation_request.translator:
            self.generate_alert(
                sender_id=requester.id,
                receiver_id=translation_request.translator.id,
                description=f"The requester {requester.email} has deleted their request."
            )

        self.db.query(TranslationRequest).filter_by(requester=requester).delete()
        self.db.commit()

    def delete_notification_by_id(self, id: int):
        notification = self.db.query(Notification).filter_by(id=id).first()

        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found.")
        
        self.db.delete(notification)
        self.db.commit()

        return notification
