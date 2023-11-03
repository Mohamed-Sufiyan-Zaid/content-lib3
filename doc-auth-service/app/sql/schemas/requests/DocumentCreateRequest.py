from pydantic import BaseModel


class DocumentRequest(BaseModel):
    doc_name: str
    template_id: int
    project_id: int
    content_library: str
    content_library_metadata: str
    doc_author: str


class DocumentUpdateRequest(BaseModel):
    doc_name: str
    id: int
    template_id: int
    project_id: int
    content_library: str
    content_library_metadata: str
    doc_author: str
