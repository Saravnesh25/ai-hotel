from openai import AzureOpenAI
from dotenv import load_dotenv
import os

class AzureConsts:
    load_dotenv()
    
    # Azure client vars
    AZURE_OPENAI_ENDPOINT = os.getenv("ENDPOINT")
    AZURE_OPENAI_API_KEY = os.getenv("SUBSCRIPTION_KEY")
    AZURE_OPENAI_API_VERSION = os.getenv("API_VERSION")
    AZURE_OPENAI_DEPLOYMENT = os.getenv("DEPLOYMENT")

    # Chatbot vars
    AZURE_OPENAI_MODEL_NAME = os.getenv("MODEL_NAME")

# Declare once here to avoid multiple instantiations
client = AzureOpenAI(
    azure_endpoint=AzureConsts.AZURE_OPENAI_ENDPOINT,
    api_key=AzureConsts.AZURE_OPENAI_API_KEY,
    api_version=AzureConsts.AZURE_OPENAI_API_VERSION,
    azure_deployment=AzureConsts.AZURE_OPENAI_DEPLOYMENT,
)

def createCompletions(messages):
    """
    Create completions using the Azure OpenAI client.
    Returns the response from the OpenAI API.
    """
    return client.chat.completions.create(
        model=AzureConsts.AZURE_OPENAI_MODEL_NAME,
        messages=messages,
    )

def determineIntent(user_input):
    """
    Determine the intent of a message using the Azure OpenAI client.
    returns "book" or "query"
    """
    
    possible_intents = ["Booking", "Query"]
    # We define clear instructions for the AI in the system message
    system_message = (
        f"You are an AI assistant for a hotel receptionist. Your task is to accurately "
        f"determine the user's primary intent from their message. "
        f"Choose ONE of the following intents: {', '.join(possible_intents)}. "
        f"If the intent is not clear or does not fit any of the categories, respond with 'Unknown'. "
        f"Respond ONLY with the intent word, no extra text or punctuation."
    )
    
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_input}
    ]
    
    try:
        intent = createCompletions(messages).choices[0].message.content.strip()

        # Validate the intent against expected values
        if intent in possible_intents:
            print(f"User input: '{user_input}' -> Detected Intent: {intent}")
            return intent
        else:
            print(f"User input: '{user_input}' -> Detected Intent: {intent} (Invalid or Unknown)")
            return "Unknown"

    except Exception as e:
        print(f"An error occurred while determining intent: {e}")
        return "Unknown"
        
        