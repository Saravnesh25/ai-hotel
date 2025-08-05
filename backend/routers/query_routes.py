from fastapi import APIRouter, File, UploadFile, WebSocket
from fastapi.params import Form

from models.azure_ids import VectorStoreAzureIDs
from utils.util import VectorStoreUtil
from utils.consts import MongoDBConsts
from utils.database import get_azure_ids_collection, get_escalated_queries_collection
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/query", tags=["query"])

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

# Get escalated queries
@router.get("/escalations")
async def get_escalations():
    """
    Get a list of escalated queries.
    """
    db = await get_escalated_queries_collection()
    return await db.find().to_list()

# Get documents stored in vector store
@router.get("/vector_store_files", response_model=VectorStoreAzureIDs)
async def get_vector_store_files():
    """
    Get a list of documents stored in the vector store.
    """
    db = await get_azure_ids_collection()
    doc = await db.find_one({"id_for": "vector_store"})
    if doc is None:
        # Return an empty/default model or raise HTTPException
        return VectorStoreAzureIDs(id_for="vector_store", id="", file_ids=[])
    
    print("Retrieved vector store document:", doc)
    
    del doc["_id"]  # Remove MongoDB's ObjectId field
    return VectorStoreAzureIDs(**doc)

# Upload document to vector store
@router.post("/upload_vector_store_document/")
async def upload_vector_store_document(
    file: UploadFile = File(...),
    document_name: str = Form(...)
):
    """
    Upload a document to the vector store.
    """
    # TODO: Process the file and upload it to Azure OpenAI
    # return "File upload functionality is not implemented yet."
    result = await VectorStoreUtil.upload_file_to_azure(file, document_name)
    if result:
        return {"message": "File uploaded successfully", "modified_count": result}
    else:
        return {"message": "File upload failed", "modified_count": 0}

# Delete document from vector store
@router.delete("/delete_vector_store_document/{file_id}", response_model=dict)
async def delete_vector_store_document(file_id: str):
    """
    Delete a document from the vector store.
    Returns the modified count of the database operation.
    """
    return await VectorStoreUtil.delete_file_from_azure(file_id)