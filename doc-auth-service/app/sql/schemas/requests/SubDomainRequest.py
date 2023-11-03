from typing import List
from pydantic import BaseModel


class SubDomainRequest(BaseModel):
    name: str
    domain_id: int