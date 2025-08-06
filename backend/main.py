from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai.resources.beta.threads.threads import Thread
from config import settings

from routers import query_routes
from utils.util import QueryAssistantUtil, determine_intent
from utils.database import close_mongo_connection, connect_to_mongo, get_escalated_queries_collection
from models.chat import ChatRequest

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    lifespan=lifespan,
    title="Azure Hotel",
)

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
        # TODO: implement booking functionality
        return "Booking functionality here"
    elif(intent_reply.lower() == "query"):
        if request.thread_id is None:
            thread: Thread = QueryAssistantUtil.create_thread()
        else:
            thread: Thread = QueryAssistantUtil.get_thread(request.thread_id)

        query_reply = await QueryAssistantUtil.get_query_answer(latest_user_message, thread)

        if query_reply is not None:
            # TODO: implement staff takeover
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
            # TODO: handle failure to get a response
            return {"message": "Failed to get a response from the assistant."}
       
    elif(intent_reply.lower() == "unknown"): # An exception is caught in determine_intent
        # TODO: handle unknown intents
        return {"message": "Unknown intent detected."}
    else: # Return the reply from the AI
        return {
            "reply": intent_reply,
        }
    
    
app.include_router(query_routes.router)