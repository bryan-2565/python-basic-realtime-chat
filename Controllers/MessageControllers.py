from fastapi import HTTPException
from sqlalchemy.orm import Session

from Models.MessageModel import GetUserMessages, SendMessage
from Schemas.MessageSchemas import Message, MessageRequest

def TrySendMessage(session: Session, ourId: str, theirId: str, messageData: MessageRequest):
    try:
        validMessage = Message(
            senderId = ourId,
            receiverId = theirId,
            **messageData.model_dump()
        )

        newMessage = SendMessage(session, validMessage)
        return newMessage

    except ValueError as valueError:
        raise HTTPException(status_code=400, detail=(str(valueError)))

    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=500, detail='Internal server error...')

def TryGetUserMessages(session: Session, ourId: str, theirId: str):
    try:
        return GetUserMessages(session, ourId, theirId);
    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=500, detail='Internal server error...')