from typing import List, Optional
from pydantic import BaseModel

class AzureIDs(BaseModel):
    """
    Model to store Azure IDs for various resources.
    """
    id_for: str
    id: str

class FileInfo(BaseModel):
    """
    Model to store information about files uploaded to Azure.
    """
    id: str
    document_name: str

class VectorStoreAzureIDs(BaseModel):
    """
    Model to store Azure IDs for vector stores.
    """
    id_for: str
    id: str
    file_ids: Optional[List[FileInfo]] = None
