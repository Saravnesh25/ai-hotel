from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai.resources.beta.threads.threads import Thread
from config import settings

from routers import query_routes
from utils.util import QueryAssistantUtil, determine_intent
from utils.database import close_mongo_connection, connect_to_mongo, get_escalated_queries_collection, get_azure_ids_collection
from models.chat import ChatRequest

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


from fastapi import Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


from utils.database import get_rooms_collection, get_database
from fastapi import Path, HTTPException

app = FastAPI(
    lifespan=lifespan,
    title="Azure Hotel",
)


# --- Booking creation endpoint (required for POST /bookings) ---
from datetime import datetime
import uuid
from bson import ObjectId
from fastapi import Body

@app.post("/bookings")
async def create_booking(booking: dict = Body(...)):
    """
    Save a booking and decrement room availability.
    """
    collection = await get_rooms_collection()
    room_id = booking.get("roomId")
    if not room_id:
        raise HTTPException(status_code=400, detail="roomId is required")
    # Find the room
    try:
        room_obj_id = ObjectId(room_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid room_id")
    room = await collection.find_one({"_id": room_obj_id})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.get("available", 0) <= 0:
        raise HTTPException(status_code=400, detail="No rooms available")
    # Decrement availability
    await collection.update_one({"_id": room_obj_id}, {"$inc": {"available": -1}})
    # Save booking
    booking_doc = {
        "_id": str(uuid.uuid4()),
        "roomId": room_id,
        "roomName": room.get("name"),
        "name": booking.get("name"),
        "email": booking.get("email"),
        "breakfast": booking.get("breakfast", False),
        "preference": booking.get("preference", ""),
        "additional": booking.get("additional", ""),
        "createdAt": datetime.utcnow(),
    }
    db = await get_database()
    await db["bookings"].insert_one(booking_doc)
    return {"success": True, "booking": booking_doc}

@app.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str = Path(...)):
    """
    Delete a booking by ID from the database.
    """
    db = await get_database()
    result = await db["bookings"].delete_one({"_id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"success": True, "deleted": booking_id}

@app.get("/bookings")
async def list_bookings():
    """
    List all bookings.
    """
    db = await get_database()
    bookings = []
    async for b in db["bookings"].find({}):
        b["_id"] = str(b["_id"])
        bookings.append(b)
    return bookings

@app.post("/rooms/{room_id}/restore")
async def restore_room(room_id: str):
    """
    Increment room availability by 1 (admin/staff action).
    """
    collection: AsyncIOMotorCollection = await get_rooms_collection()
    try:
        room_obj_id = ObjectId(room_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid room_id")
    result = await collection.update_one({"_id": room_obj_id}, {"$inc": {"available": 1}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"success": True}

@app.get("/rooms")
async def get_rooms():
    """
    Endpoint to get all rooms (for frontend display)
    """
    collection = await get_rooms_collection()
    rooms = []
    async for room in collection.find({}):
        room["_id"] = str(room["_id"])
        rooms.append({
            "id": room.get("_id"),
            "name": room.get("name"),
            "type": room.get("type"),
            "price": room.get("price"),
            "available": room.get("available"),
            "img": room.get("img", "")
        })
    return JSONResponse(content=jsonable_encoder(rooms))

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,  # Use the origins defined in settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Endpoint to receive user messages.
    """
    latest_user_message = next(
        (msg.content for msg in reversed(request.messages) if msg.role == "user"), None
    )
    
    intent_reply = determine_intent(latest_user_message)
    if(intent_reply.lower() == "booking"):
        # Fetch available rooms from MongoDB
        collection = await get_azure_ids_collection("rooms")  # adjust collection name if needed
        rooms = []
        async for room in collection.find({"available": {"$gt": 0}}):
            room["_id"] = str(room["_id"])
            rooms.append({
                "id": room.get("_id"),
                "name": room.get("name"),
                "type": room.get("type"),
                "price": room.get("price"),
                "available": room.get("available"),
                "img": room.get("img", "")
            })
        return {"rooms": rooms}
    elif(intent_reply.lower() == "query"):
        if request.thread_id is None:
            thread: Thread = QueryAssistantUtil.create_thread()
        else:
            thread: Thread = QueryAssistantUtil.get_thread(request.thread_id)

        query_reply = await QueryAssistantUtil.get_query_answer(latest_user_message, thread)

        if query_reply is not None:
            response = {
                "reply": query_reply,
                "thread_id": thread.id
            }
            
            if "notifying a staff" in query_reply.lower():
                db = await get_escalated_queries_collection()
                result = await db.insert_one({
                    "escalation_query": latest_user_message,
                    "thread_id": thread.id,
                    "status": "pending"
                })
                
            return response
        else:
            return {"message": "Failed to get a response from the assistant."}
       
    elif(intent_reply.lower() == "unknown"): # An exception is caught in determine_intent
        return {"message": "An unexpected error occurred."}
    else: # Return the reply from the AI
        return {
            "reply": intent_reply,
        }
    
    
app.include_router(query_routes.router)