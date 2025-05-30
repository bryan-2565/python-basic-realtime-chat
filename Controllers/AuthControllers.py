from fastapi import  HTTPException, Request, Response
from sqlalchemy.orm import Session

from Models.UserModel import CreateUser, GetUserByUsername
from Routes.Util.JWT import GenerateToken, ValidateToken
from Schemas.UserSchemas import User, UserRequest

def TryRegisterUser(session: Session, userRequest: UserRequest):
    try:
        validUser = User(**userRequest.model_dump())
        newUser = CreateUser(session, validUser)
        return newUser

    except ValueError as valueError:
        raise HTTPException(status_code=400, detail=(str(valueError)))

    except Exception as exception:
        print(exception)
        raise HTTPException(status_code=500, detail='Internal server error...')

def TryLoginUser(session: Session, userRequest: UserRequest, res: Response):
    try:
        user = GetUserByUsername(session, userRequest.username).__dict__
        
        if ((not user) or userRequest.password != (user["password"])):
            raise ValueError("Wrong credentials.")
        
        token = GenerateToken(user["id"])
        res.set_cookie(
            key="jwt",
            value=token,
            httponly=True,
            samesite="strict",
            secure=True  # only use True if you're serving over HTTPS
        )

        return {"detail": "Succesfully logged in"}

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail='Internal server error...')

def LogoutUser(res: Response):
    res.delete_cookie(key="jwt")
    return {"details": "Successfully logged out"}

def GetCurrentUser(request: Request):
    token = request.cookies.get("jwt")
    
    try:
        payload = ValidateToken(token)
        return payload.get("userId")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='Internal server error...')
