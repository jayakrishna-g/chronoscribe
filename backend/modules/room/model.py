import random
import string
from pydantic import BaseModel
import schedule
from modules.summarizer.model import get_summary
import asyncio


class TranscriptInstance(BaseModel):
    transcript_content: str
    transcript_index: int

class Room:
    def __init__(self, name, description, owner, room_id):
        self.room_id = room_id
        self.name = name
        self.description = description
        self.owner = owner
        self.transcript = []

        self.summaries = []
        self.start_summary_index = 0
        self.transcript_changed = False
        self.prev_summary_len = 0
        self.reactions = {}
        # self.start_summary()
        # self.create()
            
    def dict(self):
        return {
            "room_id": self.room_id,
            "name": self.name,
            "description": self.description,
            "owner": self.owner,
            "transcript": list(map(lambda x: x.dict(), self.transcript)),
            "summaries": self.summaries,
            "reactions": self.reactions
        }
    def __dict__(self):
        return self.dict()
    

    def has_newSummary(self):
        return self.prev_summary_len < len(self.summaries)
    
    def summarize(self):
        # summary = get_summary(self.current_transcript)
        # self.summaries.append(summary)
        # self.current_transcript = []
        if self.start_summary_index >= len(self.transcript):
            return
        if not self.transcript_changed:
            return
        cur_text = ''
        for i in range(self.start_summary_index, len(self.transcript)-1):
            cur_text += self.transcript[i].transcript_content
        if(len(cur_text) == 0):
            return
        self.prev_summary_len = len(self.summaries)
        summary = get_summary(cur_text)
        summary = ''.join(summary)
        self.summaries.append(summary)
        print('Summarized from index:', self.start_summary_index)
        print('Summarized:', summary)
        self.transcript_changed = False
        

    def db_dict(self):
        transcript_content = list(map(lambda x: x.transcript_content, self.transcript))
        return {
            "room_id": self.room_id,
            "name": self.name,
            "description": self.description,
            "owner": self.owner,
            "transcript": transcript_content,
            "summaries": self.summaries,
            "reactions": self.reactions
        }
    
    def save_transcript(self, data: TranscriptInstance):
        if len(self.transcript) > data.transcript_index:
            self.transcript[data.transcript_index] = data
            if (not self.transcript_changed) and data.transcript_index > 1:
                self.transcript_changed = True
                self.start_summary_index = data.transcript_index - 1
        else :
            self.transcript.append(data)
            if (not self.transcript_changed) and data.transcript_index > 1:
                self.transcript_changed = True
                self.start_summary_index = data.transcript_index - 1


class RoomCreate(BaseModel):
    name: str
    description: str
    owner: str
    