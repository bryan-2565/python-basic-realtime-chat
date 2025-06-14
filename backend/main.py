import os
from dotenv import load_dotenv

from db import createDBTables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Routes.UserRoutes import userRouter;
from Routes.AuthRoutes import authRouter;
from Routes.MessageRoutes import messageRouter;
load_dotenv()

app = FastAPI();
createDBTables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],  #type:ignore
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRouter, prefix='/user')
app.include_router(authRouter, prefix='/auth')
app.include_router(messageRouter, prefix='/messages')