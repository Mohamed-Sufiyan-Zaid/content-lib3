from pydantic import BaseModel


class FileOpenRequest(BaseModel):
    """Request body for File open/use

    Args:
        BaseModel (_type_): _description_

        Sample request :
        "id":4,
        "name":"name of template/document",
        "type":"Document/Template"
    """

    id: int
    name: str
    type: str
