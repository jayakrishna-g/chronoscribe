from datetime import datetime

from bson import ObjectId
from pydantic import BaseModel, Field


class TranscriptInstance(BaseModel):
    content: str
    index: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SummaryInstance(BaseModel):
    content: str
    index: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Question(BaseModel):
    user_id: str
    content: str
    is_answered: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class RoomMetaData(BaseModel):
    room_id: str
    name: str
    description: str
    owner_id: str


class Room(BaseModel):
    meta_data_id: ObjectId
    id: str
    transcript_file: str = ""
    summary_file: str = ""
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class RoomCreate(BaseModel):
    name: str
    description: str
    owner_id: str


class RoomUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    room_id: str
