from openai import AzureOpenAI
from openai.resources.beta.assistants import Assistant
from openai.resources.beta.threads.threads import Thread
from openai.resources.vector_stores.vector_stores import VectorStore
from motor.motor_asyncio import AsyncIOMotorDatabase

from utils.consts import AzureConsts, MongoDBConsts
from utils.database import get_azure_ids_collection

# Declare once here to avoid multiple instantiations
client = AzureOpenAI(
    azure_endpoint=AzureConsts.AZURE_OPENAI_ENDPOINT,
    api_key=AzureConsts.AZURE_OPENAI_API_KEY,
    api_version=AzureConsts.AZURE_OPENAI_API_VERSION,
    azure_deployment=AzureConsts.AZURE_OPENAI_DEPLOYMENT,
)

base_system_message = "You are a professional yet friendly AI receptionist for Azure Hotel. "

def create_completions(messages):
    """
    Create completions using the Azure OpenAI client.
    Returns the Completions object.
    """
    return client.chat.completions.create(
        model=AzureConsts.AZURE_OPENAI_MODEL_NAME,
        messages=messages,
    )

def determine_intent(user_input: str):
    """
    Determine the intent of a message using the Azure OpenAI client.
    returns "Booking", "Query", or "Unknown"
    """
    
    possible_intents = ["Booking", "Query"]
    system_message = base_system_message + (
        f"Your task is to accurately determine the user's primary intent from their message. "
        f"Choose ONE of the following intents: {', '.join(possible_intents)}. "
        f"If the intent is not clear or does not fit any of the categories, tell the user that you cannot understand their request and ask them if they wanted to book or ask a question. "
        f"Otherwise, respond ONLY with the intent word, no extra text or punctuation."
    )
    
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_input}
    ]
    
    try:
        reply = create_completions(messages).choices[0].message.content.strip()

        # Validate the intent against expected values
        # if intent in possible_intents:
        #     print(f"User input: '{user_input}' -> Detected Intent: {intent}")
        #     return intent
        # else:
        #     print(f"User input: '{user_input}' -> Detected Intent: {intent} (Invalid or Unknown)")
        #     return "Unknown"
        
        return reply

    except Exception as e:
        print(f"An error occurred while determining intent: {e}")
        return "Unknown"
    
# Declare once here to use in VectorStoreUtil and QueryAssistantUtil
azureIdsCollection = get_azure_ids_collection()

class VectorStoreUtil:
    """
    Utility class for vector store operations.
    Only one Vector Store should exist for the hotel knowledge base.
    """
    
    async def get_or_create_vector_store() -> VectorStore:
        """
        Get the VectorStore object for hotel knowledge base or create it if it doesn't exist.
        """
        # Try to retrieve the vector store ID from the database
        result = await azureIdsCollection.find_one({"id_for": "vector_store"})
        if result and "id" in result:
            # If the vector store ID exists, retrieve the vector store
            print("Retrieving existing vector store...")
            vector_store_id = result["id"]
            return client.vector_stores.retrieve(vector_store_id)
        else:
            # Create a new vector store if it doesn't exist
            print("Vector store not found, creating...")
            vector_store = client.vector_stores.create(name="Azure Hotel Knowledge Base")

            # Save the vector store ID to the database
            # The vector_store row will have an extra column for file_ids
            await azureIdsCollection.update_one(
                {"id_for": "vector_store"},
                {"$set": {"id": vector_store.id, "file_ids": []}},
                upsert=True
            )
            return vector_store

    async def upload_file_to_azure(file_path: str):
        """
        Upload a file to Azure OpenAI and saves its id into the database.
        Returns the modified count of the database operation.
        """
        with open(file_path, "rb") as file:
            # Upload file to Azure
            uploaded_file = client.files.create(
                file=file,
                purpose="assistants"
            )
           
            # Link file to the vector store
            vector_store: VectorStore = await VectorStoreUtil.get_or_create_vector_store()
            client.vector_stores.files.create(
                vector_store_id=vector_store.id,
                file_id=uploaded_file.id
            )
           
            # Save the newly uploaded file's id in the database
            result = await azureIdsCollection.update_one(
                {"id_for": "vector_store"},
                {"$addToSet": {"file_ids": uploaded_file.id}}
            )
            
            return result.modified_count
        
    async def delete_file_from_azure(file_id: str):
        """
        Delete a file from the vector store.
        Returns the modified count of the database operation.
        """
        # Delete the file from Azure OpenAI
        deleted = client.files.delete(file_id)
        
        if deleted:
            # Remove the file ID from the vector store's file_ids list in the database
            result = await azureIdsCollection.update_one(
                {"id_for": "vector_store"},
                {"$pull": {"file_ids": file_id}}
            )
            return result.modified_count
        return 0
        
class QueryAssistantUtil:
    """
    Utility class for query assistant operations.
    Only one assistant should exist for the hotel knowledge base.
    """
    
    async def get_or_create_assistant() -> Assistant:
        """
        Get the Assistant object or create a new one if it doesn't exist.
        """
        #  Try to retrieve the assistant ID from the database
        result = await azureIdsCollection.find_one({"id_for": "azure_assistant"})
        if result and "id" in result:
            # If the assistant ID exists, retrieve the assistant
            print("Retrieving existing assistant...")
            assistant_id = result["id"]
            return client.beta.assistants.retrieve(assistant_id=assistant_id)
        else:
            # Get the vector store to pass to the assistant
            vector_store = await VectorStoreUtil.get_or_create_vector_store()
            
            # Create a new assistant if it doesn't exist
            system_message = base_system_message + """
                Use your knowledge base to answer queries about the hotel.
                If you cannot answer based on the knowledge base, please escalate the query to a human staff and include these exact words: "notifying a staff" as part of your response, and let the user know that a staff member will assist them shortly.
            """
            print("Creating new assistant...")
            assistant = client.beta.assistants.create(
                name="File Search Assistant",
                instructions=system_message,
                model=AzureConsts.AZURE_OPENAI_MODEL_NAME,
                tools=[{"type": "file_search"}],  # Enable file search
                tool_resources={
                    "file_search": {
                        "vector_store_ids": [vector_store.id],
                    }
                }
            )
            
            # Save the assistant ID to the database
            await azureIdsCollection.update_one(
                {"id_for": "azure_assistant"},
                {"$set": {"id": assistant.id}},
                upsert=True
            )
            return assistant
    
    # Only one thread should exist per user session
    def create_thread() -> Thread:
        """
        Create a thread for the assistant.
        """
        return client.beta.threads.create()
    
    def get_thread(thread_id: str) -> Thread:
        """
        Get a thread by its ID.
        """
        return client.beta.threads.retrieve(thread_id=thread_id)
    
    async def answer_query(query: str, thread: Thread):
        """
        Find the answer that the user is querying.
        """
        assistant = await QueryAssistantUtil.get_or_create_assistant()
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
        )
        
        # Wait for completion
        import time
        while True:
            run_status = client.beta.threads.runs.retrieve(run.id, thread_id=thread.id)
            if run_status.status == "completed":
                break
            elif run_status.status == "failed":
                return None
            time.sleep(1)
            
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        for message in messages.data:
            if message.role == "assistant":
                return message.content[0].text.value
            
        return None

     
    
