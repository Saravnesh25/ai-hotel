from fastapi import APIRouter, Depends

from backend.utils.util import VectorStoreUtil
from utils.consts import MongoDBConsts
from utils.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/query", tags=["query"])

AZURE_IDS_COLLECTION = MongoDBConsts.COLLECTION_AZURE_IDS

@router.websocket("/ws/chat/{thread_id}")
async def websocket_chat(websocket: WebSocket, thread_id: str):
    """
    WebSocket endpoint for chat functionality.
    Accepts messages from the user and broadcasts them to .
    """
    await websocket.accept()
    while True:
        data = await websocket.receive_text()

        # TODO: implement message handling logic in here and in frontend

# Upload document to vector store
@router.post("/upload_vector_store_document/")
async def upload_vector_store_document(file: bytes, file_name: str):
    """
    Upload a document to the vector store.
    """
    # TODO: Process the file and upload it to Azure OpenAI
    return "File upload functionality is not implemented yet."
    # return await VectorStoreUtil.upload_file_to_azure(file, file_name)

# Delete document from vector store
@router.delete("/delete_vector_store_document/{file_id}", response_model=dict)
async def delete_vector_store_document(file_id: str):
    """
    Delete a document from the vector store.
    """
    return await VectorStoreUtil.delete_file_from_azure(file_id)