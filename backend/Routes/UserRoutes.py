from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Controllers.UserControllers import TryGetUserById, TryGetUsers
from Schemas.UserSchemas import UserResponse
from db import getSession

userRouter = APIRouter()

@userRouter.get('/{userId}', response_model=UserResponse)
def RequestGetUser(userId: str, session: Session = Depends(getSession)):
    return TryGetUserById(session, userId)
@userRouter.get('/', response_model=List[UserResponse])
def RequestGetUsers(session: Session = Depends(getSession)):
    return TryGetUsers(session);