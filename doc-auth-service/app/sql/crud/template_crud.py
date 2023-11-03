from app.sql import session
from sqlalchemy import and_
from app.sql.orm_models.template_model import Template
from app.sql.orm_models.document_model import Document
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger
from app.sql.utils.aws.s3 import read_a_file
from app.sql.crud.template_placeholder_crud import CRUDTemplatePlaceholder
from app.sql.crud.doc_placeholder_crud import CRUDDocPlaceholder
from app.sql.crud.chat_history_crud import CRUDChatHistory


class CRUDTemplate:
    def __init__(self):
        self.CRUDTemplatePlaceholder = CRUDTemplatePlaceholder()
        self.CRUDDocPlaceholder = CRUDDocPlaceholder()
        self.CRUDChatHistory = CRUDChatHistory()

    def create(self, **kwargs):
        """[CRUD function to create a new Template record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Template - create !")
            placeholder_ids = kwargs.get("placeholder_ids")
            del kwargs["placeholder_ids"]
            Templates = Template(**kwargs)
            with session() as transaction_session:
                transaction_session.add(Templates)
                transaction_session.commit()
                transaction_session.refresh(Templates)
                for placeholder_id in placeholder_ids:
                    placeholder_dict = {
                        "id": placeholder_id,
                        "template_id": Templates.id,
                    }
                    self.CRUDTemplatePlaceholder.create(**placeholder_dict)
            logger.info("Created a new template record")
            delattr(Templates, "s3_bucket_path")
            return Templates.__dict__
        except Exception as e:
            return get_err_json_response(
                "Error while adding to Template table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all Templates record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all Template records]
        """
        try:
            logger.info("Inside CRUD Template - read !")
            with session() as transaction_session:
                obj: Template = transaction_session.query(Template).order_by(Template.updated_date.desc()).all()
            if obj is not None:
                logger.info("fetching all the template records")
                return [row.__dict__ for row in obj]
            else:
                logger.info("No template record found")
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from Template table",
                e.args,
                501,
            )

    def get_all_by_id(self, project_id: int):
        """[CRUD function to read_all Templates record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all Template records]
        """
        try:
            logger.info("Inside CRUD Template - get by project id !")
            with session() as transaction_session:
                obj: Template = (
                    transaction_session.query(Template)
                    .filter(Template.project_id == project_id)
                    .order_by(Template.updated_date.desc())
                    .all()
                )
            if obj is not None:
                logger.info("fetching template record using id")
                return [row.__dict__ for row in obj]
            else:
                logger.info(f"no template record found for id {project_id}")
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from Template table by project id : {project_id}.",
                e.args,
                501,
            )

    def get_by_id(self, template_id: int):
        """[CRUD function to read existing template]

        Args:
            [id]: [ID of the template to be retrieved]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [Template object corresponding to requested ID]
        """
        try:
            logger.info("Inside CRUD Template - get by id !")
            with session() as transaction_session:
                obj: Template = (
                    transaction_session.query(Template)
                    .filter(Template.id == template_id)
                    .first()
                )
            if obj is not None:
                with open(obj.s3_bucket_path, "r") as html_file:
                    html_content = html_file.read()
                obj.__dict__["html_content"] = html_content
                logger.info("fetching template record using id")
                return obj.__dict__
            else:
                logger.info(f"no template record found for  template id {template_id}.")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from Template table by template id {template_id}. ",
                e.args,
                404,
            )

    def get_by_name(self, name: str):
        """[CRUD function to read a Template record]

        Args:
            Template_name (str): [Template name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [Template record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Template - get by name !")
            with session() as transaction_session:
                obj: Template = (
                    transaction_session.query(Template)
                    .filter(Template.template_name == name)
                    .first()
                )
            if obj is not None:
                logger.info("fetching template record using name")
                return obj.__dict__
            else:
                logger.info(f"no template record found for name {name}")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting by name from Template table",
                e.args,
                501,
            )

    def update(self, template_id, req):
        """[CRUD function to update existing template record]

        Args:
            template_id: [ID of the template to be updated]
            request: [Instance of CreateTemplateRequest class]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [Newly updated template obj]
        """
        try:
            logger.info("Inside CRUD Template - update !")
            placeholder_ids = req.get("placeholder_ids")
            del req["placeholder_ids"]
            with session() as transaction_session:
                obj: Template = (
                    transaction_session.query(Template)
                    .filter(Template.id == template_id)
                    .first()
                )

                for var in req.keys():
                    if var != "created_date":
                        obj.__setattr__(var, req[var])
                for placeholder_id in placeholder_ids:
                    placeholder_dict = {
                        "id": placeholder_id,
                        "template_id": template_id,
                    }
                    self.CRUDTemplatePlaceholder.create(**placeholder_dict)
                    chat_history_dict = {"chat_history": {}}
                    chat_history = self.CRUDChatHistory.create(**chat_history_dict)
                    doc_ids = (
                        transaction_session.query(Document)
                        .filter(Document.template_id == template_id)
                        .all()
                    )
                    for doc_id in doc_ids:
                        document_placeholder_dict = {
                            "doc_id": doc_id.id,
                            "template_placeholder_id": placeholder_id,
                            "chat_history_id": chat_history["id"],
                        }
                        self.CRUDDocPlaceholder.create(**document_placeholder_dict)
                transaction_session.add(obj)
                transaction_session.commit()
                transaction_session.refresh(obj)
            logger.info("Updated template record")
            delattr(obj, "s3_bucket_path")
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to templates table",
                e.args,
                501,
            )

    def delete(self, template_id: int):
        """[CRUD function to delete a Template record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Template - delete !")
            with session() as transaction_session:
                obj: Template = (
                    transaction_session.query(Template)
                    .filter(Template.id == template_id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            logger.info(f"deleted a template record for template id {template_id}.")
            return {"Message": "Template deleted successfully!"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from Template table",
                e.args,
                501,
            )
