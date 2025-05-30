from Schemas.MessageSchemas import Message
from sqlalchemy.orm import Session

def SendMessage(session: Session, message: Message) -> Message:
    session.add(message)
    session.commit()
    session.refresh(message)
    return message;

def GetUserMessages(session: Session, ourId: str, theirId: str):
    return session.query(Message).filter(
        ((Message.senderId == ourId) & (Message.receiverId == theirId)) |
        ((Message.senderId == theirId) & (Message.receiverId == ourId))
    ).order_by(Message.createdAt.desc()).all()