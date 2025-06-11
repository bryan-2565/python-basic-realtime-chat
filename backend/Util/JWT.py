from datetime import datetime, timedelta
import os
from fastapi import HTTPException
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv();
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGO = os.getenv("JWT_ALGO")

def GenerateToken(userId):
    payload = {
        "userId": userId,
        "exp": datetime.utcnow() + timedelta(hours=72)
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO) #type: ignore
    return token;

def ValidateToken(token):
    try:
        decodedToken = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO]) #type: ignore
        return decodedToken
    except JWTError as e:
        raise JWTError("Invalid or expired token...")
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")