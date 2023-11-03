from pydantic import BaseModel


class UserDetails(BaseModel):
    user_name: str
    user_type: str
