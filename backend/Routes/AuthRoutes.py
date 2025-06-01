from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from Controllers.AuthControllers import LogoutUser, TryLoginUser, TryRegisterUser
from Schemas.UserSchemas import User, UserRequest, UserResponse
from Routes.Dependencies.AuthDependency import GetCurrentUser
from db import getSession


authRouter = APIRouter();

@authRouter.post('/register')
def RequestRegisterUser(res: Response, userRequest: UserRequest, session: Session = Depends(getSession)):
    return TryRegisterUser(session, userRequest, res)

@authRouter.post('/login')
def RequestLoginUser(res: Response, userRequest: UserRequest, session: Session = Depends(getSession)):
    return TryLoginUser(session, userRequest, res)
@authRouter.post("/logout")
def RequestLogout(res: Response):
    return LogoutUser(res)

@authRouter.post('/check', response_model=UserResponse)
def RequestCurrentUser(user: User = Depends(GetCurrentUser)):
    return user