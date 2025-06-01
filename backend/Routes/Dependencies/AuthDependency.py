from fastapi import Depends, HTTPException, Request
from jose import JWTError
from sqlalchemy.orm import Session

from Util.JWT import ValidateToken
from Controllers.UserControllers import TryGetUserById
from db import getSession

def GetCurrentUser(req: Request, session: Session = Depends(getSession)):
    token = req.cookies.get("jwt")
    
    if not token:
        raise HTTPException(status_code=204, detail="No cookies!")
        
    try:
        payload = ValidateToken(token)
        userId = payload.get("userId")
        if not userId:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = TryGetUserById(session, userId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='Internal server error...')

