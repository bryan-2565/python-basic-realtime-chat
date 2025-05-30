from datetime import datetime
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from db import Base

class MessageRequest(BaseModel):
    text: str
    imgUrl: Optional[str]
class MessageResponse(MessageRequest):
    id: str

    createdAt: datetime
    updatedAt: datetime

    senderId: str
    receiverId: str

    class Config:
        orm_mode = True

# === ORM Schemas ===

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    text= Column(String(500), nullable=False)
    imgUrl = Column(String(256), nullable=True)

    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    senderId = Column(String(36), ForeignKey("users.id"), nullable=False)
    receiverId = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    sender = relationship("User", back_populates="sentMessages", foreign_keys=[senderId])
    receiver = relationship("User", back_populates="receivedMessages", foreign_keys=[receiverId])