from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

from routers import query_routes
from utils.util import QueryAssistantUtil, determine_intent
from utils.database import close_mongo_connection, connect_to_mongo
from models.chat import ChatRequest

base_url = 'http://localhost:8000/api'

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
        # TODO: implement thread creation and retrieval in frontend
        if request.thread_id is None:
            thread = QueryAssistantUtil.create_thread()
            thread_id = thread.id
        else:
            thread = QueryAssistantUtil.get_thread(thread_id)
    
        query_reply = await QueryAssistantUtil.get_query_answer(latest_user_message, thread)

        if query_reply is not None:
            # TODO: implement staff takeover
            if "notifying a staff" in query_reply.lower():
                print("Notify staff here")
                
            # TODO: receive thread id on frontend
            return {
                "reply": query_reply,
                "thread_id": thread_id
            }
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