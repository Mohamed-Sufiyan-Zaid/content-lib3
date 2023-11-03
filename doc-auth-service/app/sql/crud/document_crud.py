from app.sql import session
from app.sql.utils.exceptions import ResourceNotFound, BadRequestResult
from app.sql.orm_models.document_model import Document
from app.sql.orm_models.template_model import Template, CreationType
from app.commons.errors import get_err_json_response
from app.sql.utils.aws.s3 import read_a_file
from app.sql.utils.logs.logger_config import logger
from app.commons.constants import doc_error_message
from app.sql.crud.doc_placeholder_crud import CRUDDocPlaceholder
from app.sql.crud.template_placeholder_crud import CRUDTemplatePlaceholder
from app.sql.crud.chat_history_crud import CRUDChatHistory

class CRUDDocument:
    def __init__(self):
        self.CRUDDocPlaceholder = CRUDDocPlaceholder()
        self.CRUDTemplatePlaceholder = CRUDTemplatePlaceholder()
        self.CRUDChatHistory = CRUDChatHistory()

    def create(self, **request):
        """[CRUD function to create a new Document record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Document - create !")
            obj: Document = Document(**request)
            with session() as transaction_session:
                transaction_session.add(obj)
                transaction_session.commit()
                transaction_session.refresh(obj)
            template_placeholders = self.CRUDTemplatePlaceholder.get_by_id(
                obj.template_id
            )
            for template_placeholder in template_placeholders:
                chat_history_dict = {"chat_history": {}}
                chat_history = self.CRUDChatHistory.create(**chat_history_dict)
                document_placeholder_dict = {
                    "doc_id": obj.id,
                    "template_placeholder_id": template_placeholder["id"],
                    "chat_history_id": chat_history["id"],
                }
                self.CRUDDocPlaceholder.create(**document_placeholder_dict)
            logger.info("Created a new Document record")
            delattr(obj, "s3_bucket_path")
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to Document table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all Document record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all document records]
        """
        try:
            logger.info("Inside CRUD Document - read !")
            with session() as transaction_session:
                obj: Document = transaction_session.query(Document).order_by(Document.created_date.desc()).all()
            if obj is not None:
                logger.info("fetching all the document records")
                for row in obj:
                    delattr(row, "s3_bucket_path")
                return [row.__dict__ for row in obj]
            else:
                logger.info("No document record found")
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from document table",
                e.args,
                501,
            )

    def read_all_documents_by_ntid(self, nt_id: str):
        """[CRUD function to read_all Document record by nt_id]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all document records by nt_id]
        """
        try:
            logger.info("Inside CRUD Document - read by ntid !")
            with session() as transaction_session:
                obj: Document = (
                    transaction_session.query(Document)
                    .filter(Document.doc_author == nt_id)
                    .order_by(Document.created_date.desc())
                    .all()
                )
            if obj is not None:
                logger.info("fetching all the document records by nt_id")
                for row in obj:
                    delattr(row, "s3_bucket_path")
                return [row.__dict__ for row in obj]
            else:
                logger.info(f"No document record for nt_id {nt_id} found")
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from document table",
                e.args,
                501,
            )

    def get_by_name(self, name: str):
        """[CRUD function to read a document record]

        Args:
            document_name (str): [document name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [document record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Document - get by name !")
            with session() as transaction_session:
                obj: Document = (
                    transaction_session.query(Document)
                    .filter(Document.doc_name == name)
                    .first()
                )
            if obj is not None:
                logger.info("fetching document record using name")
                delattr(obj, "s3_bucket_path")
                return obj.__dict__
            else:
                logger.info(f"no document record found for name {name}")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                doc_error_message,
                e.args,
                501,
            )

    def get_by_id(self, id: int, get_s3: bool = False):
        """[CRUD function to read a document record]

        Args:
            document_id (str): [document id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [document record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Document - get by id !")
            with session() as transaction_session:
                obj = (
                    transaction_session.query(Document)
                    .filter(Document.id == id)
                    .first()
                )
            if obj is not None:
                logger.info("fetching document record using id")
                with open(obj.s3_bucket_path, "r") as html_file:
                    html_content = html_file.read()  # todo read from file
                obj.__dict__["html_content"] = html_content
                if not get_s3:
                    delattr(obj, "s3_bucket_path")
                return obj.__dict__
            else:
                logger.info(f"no document record found for name {id}")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                doc_error_message,
                e.args,
                501,
            )

    def get_by_project_id(self, project_id: int):
        """[CRUD function to read a document record]

        Args:
            project_id (str): [project id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [document record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Document - get by project id !")
            with session() as transaction_session:
                obj: Document = (
                    transaction_session.query(Document)
                    .filter(Document.project_id == project_id)
                    .all()
                )
            if obj is not None:
                logger.info("fetching document record using project_id")
                for row in obj:
                    delattr(row, "s3_bucket_path")
                return [row.__dict__ for row in obj]
            else:
                logger.info(f"no document record found for name {project_id}")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                doc_error_message,
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a User record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Document - update !")
            with session() as transaction_session:
                obj: Document = (
                    transaction_session.query(Document)
                    .filter(Document.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()

                if obj > 0:
                    logger.info("Updated document record")
                    # If one or more rows were updated, fetch and return the updated Document object
                    updated_document = (
                        transaction_session.query(Document)
                        .filter(Document.id == kwargs.get("id"))
                        .first()
                    )
                    delattr(updated_document, "s3_bucket_path")
                    return updated_document.__dict__
                else:
                    # No rows were updated, return None or raise an appropriate exception
                    raise ResourceNotFound()
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                f"Document with {kwargs.get('id')} does not exist! ",
                e.args,
                404,
            )

        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to document table ",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a User record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Document - delete !")
            with session() as transaction_session:
                obj: Document = (
                    transaction_session.query(Document)
                    .filter(Document.id == id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            logger.info(f"deleted a document record for id {id}")
            return {"Message": "Document deleted successfully!"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from document table",
                e.args,
                501,
            )

    def get_dashboard_stats(self, project_id: int):
        """[CRUD function to fetch a dashboard stats]

        Args:
            project_id (int): [project id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [dashboard stats which shows the count]
        """
        try:
            logger.info("Inside CRUD Document - get stats !")
            with session() as transaction_session:
                result = {
                    "created_template_count": 0,
                    "uploaded_template_count": 0,
                    "authored_document_count": 0,
                }
                document_list = (
                    transaction_session.query(Document.doc_author)
                    .filter(Document.project_id == project_id)
                    .all()
                )
                if len(document_list) == 0:
                    logger.info("No document list found")
                    raise AttributeError
                result["authored_document_count"] = len(document_list)
                logger.info("Fetched the document list by project_id")
                template_list = (
                    transaction_session.query(Template.template_creation_type)
                    .filter(Template.project_id == project_id)
                    .all()
                )
                logger.info("Fetched the template list by project_id")
                for template in template_list:
                    if template[0] == CreationType.UPLOADED:
                        result["uploaded_template_count"] += 1
                    elif template[0] == CreationType.CREATED:
                        result["created_template_count"] += 1
                logger.info("calculated dashboard stats for template")
                logger.info("fetched the dashboard stats")
                return result
        except AttributeError as e:
            logger.error(e)
            return get_err_json_response(
                "No Document found for project id",
                e.args,
                501,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while fetching dsahboard stats",
                e.args,
                501,
            )
