from app.sql import session
from app.sql.orm_models.document_model import DocumentPlaceholder
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger


class CRUDDocPlaceholder:
    def create(self, **kwargs):
        """[CRUD function to create a new doc placeholder record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Doc Placeholder - create !")
            doc_placeholder = DocumentPlaceholder(**kwargs)
            with session() as transaction_session:
                transaction_session.add(doc_placeholder)
                transaction_session.commit()
                transaction_session.refresh(doc_placeholder)
            return doc_placeholder.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to doc placeholder table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all doc placeholder record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all doc placeholder records]
        """
        try:
            logger.info("Inside CRUD Doc Placeholder - read !")
            with session() as transaction_session:
                obj: DocumentPlaceholder = transaction_session.query(
                    DocumentPlaceholder
                ).all()
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting data from doc placeholder table",
                e.args,
                501,
            )

    def get_by_id(self, id: int):
        """[CRUD function to read a doc placeholder record]

        Args:
            id (str): [id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [doc placeholder record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Doc Placeholder - get by id !")
            with session() as transaction_session:
                obj: DocumentPlaceholder = (
                    transaction_session.query(DocumentPlaceholder)
                    .filter(DocumentPlaceholder.id == id)
                    .first()
                )
            if obj is not None:
                return obj.__dict__
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from doc placeholder table",
                e.args,
                501,
            )

    def get_by_doc_id(self, doc_id: int):
        """[CRUD function to read a doc placeholder record]

        Args:
            id (str): [id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [doc placeholder record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Doc Placeholder - get by doc id !")
            with session() as transaction_session:
                obj: DocumentPlaceholder = (
                    transaction_session.query(DocumentPlaceholder)
                    .filter(DocumentPlaceholder.doc_id == doc_id)
                    .all()
                )
            for row in obj:
                delattr(row, "id")
                delattr(row, "doc_id")
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from doc placeholder table",
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a doc placeholder record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Doc Placeholder - update !")
            with session() as transaction_session:
                obj: DocumentPlaceholder = (
                    transaction_session.query(DocumentPlaceholder)
                    .filter(DocumentPlaceholder.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to doc placeholder table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a doc placeholder record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Doc Placeholder - delete !")
            with session() as transaction_session:
                obj: DocumentPlaceholder = (
                    transaction_session.query(DocumentPlaceholder)
                    .filter(DocumentPlaceholder.id == id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from doc placeholder table",
                e.args,
                501,
            )
