from app.sql.crud.document_crud import CRUDDocument
from app.sql.crud.template_crud import CRUDTemplate
from app.sql.utils.aws.s3 import (
    read_a_file,
)
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger
from app.sql.utils.exceptions import ResourceNotFound


class MiscellaneousController:
    def __init__(self):
        self.CRUDDocument = CRUDDocument()
        self.CRUDTemplate = CRUDTemplate()

    def file_data(self, request):
        """[Controller to fetch file content from s3]

        Args:
            request: request with s3 bucket path

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [response with file content stats]
        """
        try:
            logger.info("Inside fetch file data!")
            s3_path = ""
            html_content = read_a_file(s3_path)
            response_obj = {
                "html_text": html_content.value,
                "id": request.id,
                "name": request.name,
                "type": request.type,
            }
            return response_obj
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(e.args, e.args, 404)
        except Exception as err:
            logger.error(err)
            return get_err_json_response(
                "Error while reading file data from s3 in controller",
                err.args,
                501,
            )
