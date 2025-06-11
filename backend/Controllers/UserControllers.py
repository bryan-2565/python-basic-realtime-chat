from fastapi import HTTPException
from sqlalchemy.orm import Session

from Models.UserModel import GetUser, GetUsers, UpdatePFP
from Schemas.UserSchemas import PfpUpdateRequest, UserResponse

def TryGetUserById(session: Session, userId: str):
    try:
        return GetUser(session, userId);
    except Exception as e:
        print(e)
        return HTTPException(status_code=500, detail="Internal server error...")

def TryGetUsers(session: Session):
    try: 
        return GetUsers(session);
    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=500, detail='Internal server error...')

def TryUpdatePFP(session: Session, user: UserResponse, url: PfpUpdateRequest):
    try:
        updatedUser = UpdatePFP(session, user, url)

        if (updatedUser == None):
            raise HTTPException(status_code=500, detail='Internal server error...')

        return updatedUser 
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='Internal server error...')