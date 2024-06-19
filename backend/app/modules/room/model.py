from pydantic import BaseModel
from typing_extensions import Any

from app.modules.summarizer.model import get_summary


class TranscriptInstance(BaseModel):
    transcript_content: str
    transcript_index: int


class Room:
    def __init__(self, name: str, description: str, owner: str, room_id: str) -> None:
        self.room_id: str = room_id
        self.name: str = name
        self.description: str = description
        self.owner: str = owner
        self.transcript: list[TranscriptInstance] = []

        self.summaries: list[str] = [""]
        self.start_summary_index: int = 0
        self.transcript_changed: bool = False
        self.prev_summary_len: int = 0
        self.reactions: dict[str, Any] = {}
        return None
        # self.start_summary()
        # self.create()

    def dict(self) -> dict:
        return {
            "room_id": self.room_id,
            "name": self.name,
            "description": self.description,
            "owner": self.owner,
            "transcript": [x.dict() for x in self.transcript],
            "summaries": self.summaries,
            "reactions": self.reactions,
        }

    def has_newSummary(self) -> bool:
        return self.prev_summary_len < len(self.summaries)

    def summarize(self) -> None:
        # summary = get_summary(self.current_transcript)
        # self.summaries.append(summary)
        # self.current_transcript = []
        if self.start_summary_index >= len(self.transcript):
            return
        if not self.transcript_changed:
            return
        cur_text = ""
        for i in range(self.start_summary_index, len(self.transcript) - 1):
            cur_text += self.transcript[i].transcript_content
        if len(cur_text) == 0:
            return
        self.prev_summary_len = len(self.summaries)
        summary = get_summary(cur_text)
        summary_str: str = "".join(summary)
        self.summaries.append(summary_str)
        print("Summarized from index:", self.start_summary_index)
        print("Summarized:", summary)
        self.transcript_changed = False

    def db_dict(self):
        transcript_content = [x.transcript_content for x in self.transcript]
        return {
            "room_id": self.room_id,
            "name": self.name,
            "description": self.description,
            "owner": self.owner,
            "transcript": transcript_content,
            "summaries": self.summaries,
            "reactions": self.reactions,
        }

    def save_transcript(self, data: TranscriptInstance) -> None:
        if len(self.transcript) > data.transcript_index:
            self.transcript[data.transcript_index] = data
            if (not self.transcript_changed) and data.transcript_index > 1:
                self.transcript_changed = True
                self.start_summary_index = data.transcript_index - 1
        else:
            self.transcript.append(data)
            if (not self.transcript_changed) and data.transcript_index > 1:
                self.transcript_changed = True
                self.start_summary_index = data.transcript_index - 1


class RoomCreate(BaseModel):
    name: str
    description: str
    owner: str
