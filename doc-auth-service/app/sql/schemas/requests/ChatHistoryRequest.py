from typing import List
from pydantic import BaseModel


class ChatHistoryItem(BaseModel):
    msg: str
    response: str


class ChatHistoryRequest(BaseModel):
    chat_history: List[dict]
