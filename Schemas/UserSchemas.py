from datetime import datetime
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from Schemas.MessageSchemas import Message
from db import Base

# === Validation Schemas ===
class UserRequest(BaseModel):
    username: str
    password: str
    pfpUrl: Optional[str]
class UserResponse(BaseModel):
    id: str
    username: str
    pfpUrl: str

    createdAt: datetime
    updatedAt: datetime

    class Config:
        orm_mode = True

# === ORM Schemas ===

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    username = Column(String(32), unique=True, nullable=False)
    password = Column(String(256), nullable=False)
    pfpUrl = Column(String(256), nullable=True)

    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sentMessages = relationship("Message", back_populates="sender", foreign_keys=[Message.senderId])
    receivedMessages = relationship("Message", back_populates="receiver", foreign_keys=[Message.receiverId])