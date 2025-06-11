from fastapi import  HTTPException, Request, Response
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from Models.UserModel import CreateUser, GetUserByUsername
from Util.JWT import GenerateToken
from Schemas.UserSchemas import User, UserRequest

def TryRegisterUser(session: Session, userRequest: UserRequest, res: Response):
    try:
        validUser = User(**userRequest.model_dump())
        newUser = CreateUser(session, validUser).__dict__

        token = GenerateToken(newUser["id"])
        return res.set_cookie(
            key="jwt",
            value=token,
            httponly=True,
            samesite="strict",
            secure=False  # only use True if you're serving over HTTPS
        )

    except ValueError as valueError:
        raise HTTPException(status_code=400, detail=(str(valueError)))

    except IntegrityError as e:
        raise HTTPException(status_code=409, detail="Username already exists.")

    except Exception as exception:
        raise HTTPException(status_code=500, detail='Internal server error...')

def TryLoginUser(session: Session, userRequest: UserRequest, res: Response):
    try:
        userModel = GetUserByUsername(session, userRequest.username)
        if (not userModel):
            raise ValueError("Wrong credentials")

        user = userModel.__dict__

        if (userRequest.password != user["password"]):
            raise ValueError("Wrong credentials")
        
        token = GenerateToken(user["id"])
        return res.set_cookie(
            key="jwt",
            value=token,
            httponly=True,
            samesite="strict",
            secure=False  # only use True if you're serving over HTTPS
        )

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail='Internal server error...')

def LogoutUser(res: Response):
    res.delete_cookie(key="jwt")
    return {"detail": "Successfully logged out"}