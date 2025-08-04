from typing import List, Optional
from pydantic import BaseModel


class Message(BaseModel):
    """
    Model to represent a message in the chat.
    """
    role: str
    content: str
    
class ChatRequest(BaseModel):
    """
    Model to represent a chat request.
    """
    messages: List[Message]
    thread_id: Optional[str] = None