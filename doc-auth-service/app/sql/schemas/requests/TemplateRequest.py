from pydantic import BaseModel


class TemplateRequest(BaseModel):
    ntid: str
    template_name: str
    project_id: int
    template_creation_type: str
    template_file_type: str


class UpdateTemplateRequest(BaseModel):
    ntid: str
    template_name: str
    project_id: int
    template_creation_type: str
    template_file_type: str
    s3_bucket_path: str
    created_date: str
