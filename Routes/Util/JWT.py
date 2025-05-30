from datetime import datetime, timedelta
from fastapi import HTTPException
from jose import JWTError, jwt

def GenerateToken(userId):
    payload = {
        "userId": userId,
        "exp": datetime.utcnow() + timedelta(hours=72)
    }

    token = jwt.encode(payload, "ANDDADADADADATILLTHEDAYTHATIDIEEE", algorithm="HS256")
    return token;

def ValidateToken(token):
    try:
        decodedToken = jwt.decode(token, "ANDDADADADADATILLTHEDAYTHATIDIEEE", algorithms=["HS256"])
        return decodedToken
    except JWTError as e:
        print(e)
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")