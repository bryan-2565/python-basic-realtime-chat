import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from dotenv import load_dotenv
load_dotenv();

DB = os.getenv("DB")

engine = create_engine(DB) #type: ignore
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
