from datetime import datetime
from typing import Optional
from uuid import uuid4
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from db import Base

# === Validation Schemas ===
# == User ==
class UserRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str
    # password: str = Field(..., min_length=8)
    pfpUrl: Optional[str] = ""

    @field_validator('username')
    @classmethod
    def username_no_spaces(cls, value: str) -> str:
        if ' ' in value:
            raise ValueError('Username must not contain spaces')
        return value
        
class UserResponse(BaseModel):
    id: str
    username: str
    pfpUrl: str

    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True, json_encoders={datetime: lambda v: v.isoformat()})

# == Message ==
class MessageRequest(BaseModel):
    text: str
    imgUrl: Optional[str] = ""

class MessageResponse(MessageRequest):
    id: str

    createdAt: datetime
    updatedAt: datetime

    senderId: str
    receiverId: str

    sender: UserResponse
    receiver: UserResponse

    model_config = ConfigDict(from_attributes=True, json_encoders={datetime: lambda v: v.isoformat()})


# === ORM Schemas ===

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    text = Column(String(800), nullable=False)
    imgUrl = Column(String(256), nullable=True)

    createdAt = Column(DATETIME(fsp=6), default=datetime.now)
    updatedAt = Column(DATETIME(fsp=6), default=datetime.now, onupdate=datetime.now)

    senderId = Column(String(36), ForeignKey("users.id"), nullable=False)
    receiverId = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    sender = relationship("User", back_populates="sentMessages", foreign_keys=[senderId])
    receiver = relationship("User", back_populates="receivedMessages", foreign_keys=[receiverId])

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "imgUrl": self.imgUrl,
            "createdAt": self.createdAt.isoformat() if self.createdAt else None, #type: ignore
            "updatedAt": self.updatedAt.isoformat() if self.updatedAt else None, #type: ignore
            "senderId": self.senderId,
            "receiverId": self.receiverId,
            "sender": {
                "id": self.sender.id,
                "username": self.sender.username,
                "avatarUrl": self.sender.avatarUrl if hasattr(self.sender, "avatarUrl") else None
            } if self.sender else None,
            "receiver": {
                "id": self.receiver.id,
                "username": self.receiver.username,
                "avatarUrl": self.receiver.avatarUrl if hasattr(self.receiver, "avatarUrl") else None
            } if self.receiver else None,
        }


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    username = Column(String(32), unique=True, nullable=False)
    password = Column(String(256), nullable=False)
    pfpUrl = Column(String(256), nullable=True)

    createdAt = Column(DATETIME(fsp=6), default=datetime.now)
    updatedAt = Column(DATETIME(fsp=6), default=datetime.now, onupdate=datetime.now)

    sentMessages = relationship("Message", back_populates="sender", foreign_keys=[Message.senderId])
    receivedMessages = relationship("Message", back_populates="receiver", foreign_keys=[Message.receiverId])
