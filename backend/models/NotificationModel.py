from pydantic import BaseModel

class NotificationModel(BaseModel):
    id: int
    user_origin_id: int
    user_destination_id: int
    description: str