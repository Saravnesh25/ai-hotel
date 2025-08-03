from fastapi import FastAPI
from routers import query_routes

from utils.util import QueryAssistantUtil, determine_intent

base_url = 'http://localhost:8000'


app = FastAPI()

@app.post("/chat")
def chat(user_message: str, thread_id: str = None):
    """
    Endpoint to receive user messages.
    """
    
    intent_reply = determine_intent(user_message)
    if(intent_reply.lower() == "booking"):
        # TODO: implement booking functionality
        return "Booking functionality here"
    elif(intent_reply.lower() == "query"):
        # TODO: implement thread creation and retrieval in frontend
        if thread_id is None:
            thread = QueryAssistantUtil.create_thread()
            thread_id = thread.id
        else:
            thread = QueryAssistantUtil.get_thread(thread_id)
    
        query_reply = QueryAssistantUtil.get_query_answer(user_message, thread)

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
        return intent_reply
    
    
app.include_router(query_routes.router)