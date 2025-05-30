from fastapi import HTTPException
from sqlalchemy.orm import Session

from Models.UserModel import GetUser, GetUsers
from Schemas.UserSchemas import User, UserRequest

def TryGetUser(session: Session, userId: str):
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