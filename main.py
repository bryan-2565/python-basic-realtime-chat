from dotenv import load_dotenv
from fastapi import FastAPI
from db import createDBTables

from Routes.UserRoutes import userRouter;
from Routes.AuthRoutes import authRouter;
from Routes.MessageRoutes import messageRouter;
load_dotenv()

app = FastAPI();
createDBTables()
app.include_router(userRouter)
app.include_router(authRouter, prefix='/auth')
app.include_router(messageRouter, prefix='/messages')