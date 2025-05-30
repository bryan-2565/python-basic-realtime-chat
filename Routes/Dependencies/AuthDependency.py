from fastapi import Depends, HTTPException, Request
from jose import JWTError

from Routes.Util.JWT import ValidateToken

def GetCurrentUser(req: Request):
    token = req.cookies.get("jwt")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    try:
        payload = ValidateToken(token)
        return payload.get("userId")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='Internal server error...')

