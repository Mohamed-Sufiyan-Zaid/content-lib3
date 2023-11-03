from app.sql import session
from app.sql.orm_models.template_model import TemplatePlaceholder
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger


class CRUDTemplatePlaceholder:
    def create(self, **kwargs):
        """[CRUD function to create a new template placeholder record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Template placeholder - create !")
            template_placeholder = TemplatePlaceholder(**kwargs)
            with session() as transaction_session:
                transaction_session.add(template_placeholder)
                transaction_session.commit()
                transaction_session.refresh(template_placeholder)
            return template_placeholder.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to template placeholder table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all template placeholder record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all template placeholder records]
        """
        try:
            logger.info("Inside CRUD Template placeholder - read !")
            with session() as transaction_session:
                obj: TemplatePlaceholder = transaction_session.query(
                    TemplatePlaceholder
                ).all()
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting data from template placeholder table",
                e.args,
                501,
            )

    def get_by_id(self, template_id: int):
        """[CRUD function to read a template placeholder record]

        Args:
            template_id (int): [template_id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [template placeholder record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Template placeholder - get by id !")
            with session() as transaction_session:
                obj: TemplatePlaceholder = (
                    transaction_session.query(TemplatePlaceholder)
                    .filter(TemplatePlaceholder.template_id == template_id)
                    .all()
                )
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from template placeholder table",
                e.args,
                501,
            )

    def get_count_ids(self, template_id: int):
        """[CRUD function to read a template placeholder count]

        Args:
            template_id (int): [template_id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [template placeholder count matching the criteria]
        """
        try:
            logger.info("Inside CRUD Template placeholder - get id count !")
            with session() as transaction_session:
                obj = (
                    transaction_session.query(TemplatePlaceholder.id)
                    .filter(TemplatePlaceholder.template_id == template_id)
                    .all()
                )
            if obj is not None:
                return len(obj)
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from template placeholder table",
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a template placeholder record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Template placeholder - update !")
            with session() as transaction_session:
                obj: TemplatePlaceholder = (
                    transaction_session.query(TemplatePlaceholder)
                    .filter(TemplatePlaceholder.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to template placeholder table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a template placeholder record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Template placeholder - delete !")
            with session() as transaction_session:
                obj: TemplatePlaceholder = (
                    transaction_session.query(TemplatePlaceholder)
                    .filter(TemplatePlaceholder.id == id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from template placeholder table",
                e.args,
                501,
            )
