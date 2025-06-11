import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.exceptions import WebSocketRequestValidationError
from sqlalchemy.orm import Session
from Controllers.MessageControllers import TryGetUserMessages, TrySendMessage
from Routes.Dependencies.AuthDependency import GetCurrentUser
from Schemas.UserSchemas import UserResponse, MessageRequest, MessageResponse
from db import getSession

messageRouter = APIRouter()

# @messageRouter.post('/api/{theirId}', response_model=MessageResponse)
# async def RequestSendMessage(theirId: str, messageRequest: MessageRequest, ourUser: UserResponse = Depends(GetCurrentUser), session: Session = Depends(getSession)):
#     return TrySendMessage(session, ourUser, theirId, messageRequest)


# === Web Sockets ===
class ConnectionManager:
    def __init__(self):
        self.activeConnections: dict[str, WebSocket] = {};

    async def connect(self, userId: str, websocket: WebSocket):
        await websocket.accept();
        self.activeConnections[userId] = websocket;

    def disconnect(self, userId: str):
        if(userId in self.activeConnections):
            del self.activeConnections[userId];
            
    async def sendMessage(self, message: str, receiverId: str):
        if (receiverId in self.activeConnections):
            await self.activeConnections[receiverId].send_text(message)
            return True
        return False

manager = ConnectionManager();

@messageRouter.websocket("/ws/{userId}")
async def websocketSendMessage(ourWs: WebSocket, userId: str, session: Session = Depends(getSession)):
    try:
        await manager.connect(userId, ourWs)
    except WebSocketRequestValidationError as e:
        raise #

    try:
        while True:
            messageFromClient = await ourWs.receive_text();

            try:
                messageData = json.loads(messageFromClient)
                receiverId = messageData["receiverId"];

                try:
                    messageRequest = MessageRequest(
                        text= messageData["text"],
                        imgUrl= ""
                    )

                    
                    newMessage = TrySendMessage(session, userId, receiverId, messageRequest)
                    messageResponse = (MessageResponse.model_validate(newMessage)).model_dump_json()

                except Exception as e:
                    print(e)
                    raise WebSocketDisconnect()

                await manager.sendMessage((messageResponse), receiverId)
                await ourWs.send_text(messageResponse)
            except json.JSONDecodeError as e:
                await ourWs.send_text("JSON ERROR")

    except WebSocketDisconnect as e:
        manager.disconnect(userId)

@messageRouter.get('/{theirId}', response_model=List[MessageResponse])
def RequestGetUserMessages(theirId: str, ourUser: UserResponse = Depends(GetCurrentUser), session: Session = Depends(getSession)):
    return TryGetUserMessages(session, ourUser, theirId);