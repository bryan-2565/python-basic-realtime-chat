import json
from dotenv import load_dotenv
from fastapi.exceptions import WebSocketRequestValidationError
from db import createDBTables
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from Routes.UserRoutes import userRouter;
from Routes.AuthRoutes import authRouter;
from Routes.MessageRoutes import messageRouter;
load_dotenv()

app = FastAPI();
createDBTables()

app.add_middleware(CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(userRouter)
app.include_router(authRouter, prefix='/auth')
app.include_router(messageRouter, prefix='/messages')

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

@app.websocket("/ws/{userId}")
async def websocketEndpoint(websocket: WebSocket, userId: str):
    try:
        await manager.connect(userId, websocket)
    except WebSocketRequestValidationError as e:
        print(e)

    try:
        while True:
            messageFromClient = await websocket.receive_text();

            try:
                messageData = json.loads(messageFromClient)
                messageText = messageData["text"]
                receiverId = messageData["receiverId"]

                message = {
                    "senderId": userId,
                    "text": messageText
                }

                await manager.sendMessage(json.dumps(message), receiverId)

            except json.JSONDecodeError as e:
                print(f"JSON ERR: {e}")
                await websocket.send_text("JSON ERROR")

    except WebSocketDisconnect:
        manager.disconnect(userId)