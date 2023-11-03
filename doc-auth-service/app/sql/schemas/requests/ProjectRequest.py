from pydantic import BaseModel
from datetime import date


class ProjectRequest(BaseModel):
    ntid: str
    domain_name: str
    sub_domain_name: str
    project_name: str
    group_name: str


class UpdateProjectRequest(BaseModel):
    ntid: str
    domain_name: str
    sub_domain_name: str
    project_name: str
    project_id: int
    group_name: str
