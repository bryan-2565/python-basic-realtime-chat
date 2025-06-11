import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv();

cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure = False
)

def UploadImage(url: str) -> str:
    return cloudinary.uploader.upload(url)