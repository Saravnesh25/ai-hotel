import os
from typing import List
from pydantic_settings import BaseSettings

from utils.consts import MongoDBConsts

class Settings(BaseSettings):
    # Database Configuration
    mongodb_connection_string: str = MongoDBConsts.MONGODB_CONNECTION_STRING
    database_name: str = MongoDBConsts.MONGODB_DATABASE_NAME
    
    # JWT Configuration
    secret_key: str = "your-super-secret-jwt-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost",
        "http://localhost:3000",
    ]
    
    # File Upload Configuration
    max_file_size: int = 10485760  # 10MB in bytes
    upload_dir: str = "uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings() 