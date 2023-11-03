from pydantic import BaseModel
from enum import Enum


class Status(str, Enum):
    failure = "failure"
    success = "success"


class HealthCheckResponse(BaseModel):
    status: Status
    message: str
