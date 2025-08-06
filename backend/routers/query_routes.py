from typing import List
from fastapi import APIRouter, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.params import Form
from pydantic import BaseModel

from models.escalations import Escalations
from models.azure_ids import VectorStoreAzureIDs
from utils.util import VectorStoreUtil
from utils.consts import MongoDBConsts
from utils.database import get_azure_ids_collection, get_escalated_queries_collection
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/query", tags=["query"])

active_connections = {}  # {thread_id: {"user": websocket, "staff": websocket}}

@router.websocket("/ws/chat/{thread_id}/{role}")
async def websocket_chat(websocket: WebSocket, thread_id: str, role: str):
    """
    WebSocket endpoint for chat functionality.
    Accepts messages from the user and broadcasts them to .
    """
    await websocket.accept()
    if thread_id not in active_connections:
        active_connections[thread_id] = {}
    active_connections[thread_id][role] = websocket
        
    try:
        while True:
            data = await websocket.receive_text()
            
            # Forward message to the other party
            respond_to = "staff" if role == "user" else "user"
            print("Received message:", data, "from role:", role, ", sending to :", respond_to)
            if respond_to in active_connections[thread_id]:
                await active_connections[thread_id][respond_to].send_text(data)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for thread {thread_id} and role {role}")
        pass
    finally:
        # Remove connection on disconnect
        active_connections[thread_id].pop(role, None)
        if not active_connections[thread_id]:
            active_connections.pop(thread_id, None)

# Get escalated queries
@router.get("/escalations", response_model=List[Escalations])
async def get_escalations():
    """
    Get a list of escalated pending queries.
    """
    db = await get_escalated_queries_collection()
    docs = await db.find({"status": "pending"}).to_list(length=None)
    
    # Prepare the docs for object creation
    for doc in docs:
        del doc["_id"]
    return [Escalations(**doc) for doc in docs]

@router.post("/escalations/{thread_id}/")
async def respond_to_escalation(thread_id: str):
    """
    Respond to an escalation by assigning a staff member.
    """
    db = await get_escalated_queries_collection()
    result = await db.update_one(
        {"thread_id": thread_id},
        {"$set": {"status": "in_progress"}}
    )
    
    return {"modified_count": result.modified_count}

class ThreadIdRequest(BaseModel):
    thread_id: str
    
@router.post("/escalations/resolve")
async def resolve_escalation(request: ThreadIdRequest):
    """
    Mark an escalation as resolved.
    """
    db = await get_escalated_queries_collection()
    result = await db.update_one(
        {"thread_id": request.thread_id},
        {"$set": {"status": "resolved"}}
    )
    
    return {"modified_count": result.modified_count}

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
    
    # Prepare the doc for object creation
    del doc["_id"] 
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
    result = await VectorStoreUtil.upload_file_to_azure(file, document_name)
    if result:
        return {"message": "File uploaded successfully", "modified_count": result}
    else:
        return {"message": "File upload failed", "modified_count": 0}

# Delete document from vector store
@router.delete("/delete_vector_store_document/{file_id}")
async def delete_vector_store_document(file_id: str):
    """
    Delete a document from the vector store.
    Returns the modified count of the database operation.
    """
    return await VectorStoreUtil.delete_file_from_azure(file_id)