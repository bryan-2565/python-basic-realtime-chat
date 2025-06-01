from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Controllers.MessageControllers import TryGetUserMessages, TrySendMessage
from Routes.Dependencies.AuthDependency import GetCurrentUser
from Schemas.UserSchemas import UserResponse, MessageRequest, MessageResponse
from db import getSession

messageRouter = APIRouter()

@messageRouter.post('/{theirId}', response_model=MessageResponse)
async def RequestSendMessage(theirId: str, messageRequest: MessageRequest, ourUser: UserResponse = Depends(GetCurrentUser), session: Session = Depends(getSession)):
    return TrySendMessage(session, ourUser, theirId, messageRequest)

@messageRouter.get('/{theirId}', response_model=List[MessageResponse])
def RequestGetUserMessages(theirId: str, ourUser: UserResponse = Depends(GetCurrentUser), session: Session = Depends(getSession)):
    return TryGetUserMessages(session, ourUser, theirId);