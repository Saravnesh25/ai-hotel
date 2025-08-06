from pydantic import BaseModel

# Status can be "pending", "in_progress", or "resolved"
class Escalations(BaseModel):
    """
    Model to store escalated queries.
    """
    thread_id: str
    escalation_query: str
    status: str