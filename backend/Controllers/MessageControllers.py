from fastapi import HTTPException
from sqlalchemy.orm import Session

from Models.MessageModel import GetUserMessages, SendMessage
from Schemas.UserSchemas import UserResponse, Message, MessageRequest

def TrySendMessage(session: Session, ourUser: UserResponse, theirId: str, messageData: MessageRequest):
    try:
        validMessage = Message(
            senderId = ourUser.id,
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

def TryGetUserMessages(session: Session, ourUser: UserResponse, theirId: str):
    try:
        return GetUserMessages(session, ourUser.id, theirId);
    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=500, detail='Internal server error...')