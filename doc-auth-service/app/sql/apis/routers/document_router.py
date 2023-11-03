import json
from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.document_controller import DocumentController
from fastapi import File, UploadFile, Form
from app.sql.schemas.requests.DocumentCreateRequest import DocumentRequest


document_router = APIRouter(prefix=config["api_prefix"])


@document_router.get("/document/all")
async def get_all_documents():
    """[Get List of all documents]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of documents]
    """
    list_of_documents = DocumentController().get_all_documents_controller()
    return list_of_documents


@document_router.get("/document/mine")
async def get_documents_by_ntid(nt_id: str):
    """[Get List of all documents by nt_id]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of documents]
    """
    list_of_documents = DocumentController().get_documents_by_ntid_controller(nt_id)
    return list_of_documents


@document_router.post("/document")
async def create_document(create_document_request: DocumentRequest):
    """[API router to create new document into the system]

    Args:
        create_document_request (create): [New document details]

    Raises:
        HTTPException: [Unauthorized exception when invalid token is passed]
        error: [Exception in underlying controller]

    Returns:
        [createResponse]: [create new document response]
    """
    document_obj = DocumentController().create_document_controller(
        create_document_request
    )
    return document_obj


@document_router.get("/document/{document_id}")
async def get_by_document_id(document_id: int):
    """[Get document by id]

    Raises:
        error: [Error details]

    Returns:
        dict: document record
    """
    return DocumentController().read_by_id(document_id)


@document_router.put("/document/{document_id}")
async def update_document(
    document_id: int,
    update_document_request: str = Form(...),
    html_file: UploadFile = File(),
):
    """[Update document by document name]

    Raises:
        error: [Error details]

    Returns:
        [str]: [Success response]
    """
    update_document_request = json.loads(update_document_request)
    document_obj = DocumentController().update_document_controller(
        document_id, update_document_request, html_file
    )
    return document_obj


@document_router.delete("/document/{document_id}")
async def delete_document(document_id: int):
    """[Get List of all document]

    Raises:
        error: [Error details]

    Returns:
        [str]: [Success response]
    """
    document_obj = DocumentController().delete_Document_controller(document_id)
    return document_obj


@document_router.get("/document/{document_name}", include_in_schema=False)
async def get_document_by_name(document_name: str):
    """[Get document by name]

    Raises:
        error: [Error details]

    Returns:
        dict: document record
    """
    document = DocumentController().read_by_name(document_name)
    return document


@document_router.get("/document")
async def get_document_by_project_id(project_id: int):
    """[Get document by project id]

    Raises:
        error: [Error details]

    Returns:
        dict: document record
    """
    document = DocumentController().read_by_project_id(project_id)
    return document


@document_router.get("/download", include_in_schema=False)
async def download_file(id: int):
    """[API router to download document by id]

    Args:
        id: chat id

    Raises:
        HTTPException: [Unauthorized exception when invalid token is passed]
        error: [Exception in underlying controller]

    Returns:
        [File]: [downloaded file]
    """
    file = DocumentController().download_file(id)
    return file
