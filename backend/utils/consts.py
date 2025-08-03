from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class AzureConsts:    
    # Azure client vars
    AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
    AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")

    # Chatbot vars
    AZURE_OPENAI_MODEL_NAME = os.getenv("AZURE_OPENAI_MODEL_NAME")

class MongoDBConsts:
    # MongoDB connection string
    MONGODB_CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING")
    MONGODB_DATABASE_NAME = os.getenv("MONGODB_DATABASE_NAME")

    COLLECTION_AZURE_IDS = "azure_openai_ids"