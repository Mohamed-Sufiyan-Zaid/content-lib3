from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException


class ErrorMessage(Exception):
    def __init__(self, message: str, data, code: int):
        self.errorMessage = message
        self.errorData = data
        self.statusCode = code


def get_err_json_response(message: str, data, status_code: int):
    raise HTTPException(
        status_code=status_code,
        detail=jsonable_encoder(ErrorMessage(message, data, status_code).__dict__),
    )
