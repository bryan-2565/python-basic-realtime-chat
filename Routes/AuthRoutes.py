from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from Controllers.AuthControllers import LogoutUser, TryLoginUser, TryRegisterUser, GetCurrentUser
from Schemas.UserSchemas import UserRequest, UserResponse
from db import getSession


authRouter = APIRouter();

@authRouter.post('/register', response_model=UserResponse)
def RequestRegisterUser(userRequest: UserRequest, session: Session = Depends(getSession)):
    return TryRegisterUser(session, userRequest)

@authRouter.post('/login')
def RequestLoginUser(res: Response, userRequest: UserRequest, session: Session = Depends(getSession)):
    return TryLoginUser(session, userRequest, res)
@authRouter.post("/logout")
def RequestLogout(res: Response):
    return LogoutUser(res)

@authRouter.post('/check')
def RequestCurrentUser(req: Request):
    return GetCurrentUser(req)