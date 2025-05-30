from Schemas.UserSchemas import User
from sqlalchemy.orm import Session

def CreateUser(session: Session, newUser: User) -> User:
    session.add(newUser)
    session.commit()
    session.refresh(newUser)
    return newUser

def GetUsers(session: Session):
    users = session.query(User).all();
    return users

def GetUser(session: Session, userId: str):
    return session.query(User).filter(User.id == userId).first()

def GetUserByUsername(session: Session, username: str):
    return session.query(User).filter(User.username == username).first()

def GetUserById(session: Session, id: str):
    return session.query(User).filter(User.id == id).first()