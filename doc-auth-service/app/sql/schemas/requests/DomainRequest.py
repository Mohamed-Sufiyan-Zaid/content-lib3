from typing import List
from pydantic import BaseModel


class DomainRequest(BaseModel):
    name: str