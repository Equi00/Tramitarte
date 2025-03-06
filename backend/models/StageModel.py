from pydantic import BaseModel

class StageModel(BaseModel):
    id: int
    description: str