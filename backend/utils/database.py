from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection
from pymongo import MongoClient
import gridfs
from utils.consts import MongoDBConsts
from config import settings

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None
    fs = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(settings.mongodb_connection_string)
    db.database = db.client[settings.database_name]
    
    # Create GridFS for file storage
    sync_client = MongoClient(settings.mongodb_connection_string)
    sync_database = sync_client[settings.database_name]
    db.fs = gridfs.GridFS(sync_database)
    
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    db.client.close()
    print("Disconnected from MongoDB")

async def get_database() -> AsyncIOMotorDatabase:
    return db.database

# Get the azure_openai_ids collection
def get_azure_ids_collection() -> AsyncIOMotorCollection:
    db = get_database()
    return db[MongoDBConsts.COLLECTION_AZURE_IDS]

async def get_gridfs():
    return db.fs