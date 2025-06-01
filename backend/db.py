from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("mysql+pymysql://mysql:password@localhost:3306/apy")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def getSession():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def createDBTables():
    return Base.metadata.create_all(bind=engine)
