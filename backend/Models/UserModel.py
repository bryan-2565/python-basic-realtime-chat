from Schemas.UserSchemas import PfpUpdateRequest, User, UserResponse
from sqlalchemy.orm import Session

from Util import CloudinaryUtil

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

def UpdatePFP(session: Session, user: UserResponse, url: PfpUpdateRequest):
    imgUrl = url.model_dump()['url'];
    newImgUrl = CloudinaryUtil.UploadImage(imgUrl);

    if user:
        user.pfpUrl = newImgUrl["secure_url"];
        session.commit();
        session.refresh(user);
        return user;
    return None;