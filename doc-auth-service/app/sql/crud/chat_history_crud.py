from app.sql import session
from app.sql.orm_models.document_model import ChatHistory
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger


class CRUDChatHistory:
    def create(self, **kwargs):
        """[CRUD function to create a new chat history record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Chat History - create !")
            chat_history = ChatHistory(**kwargs)
            with session() as transaction_session:
                transaction_session.add(chat_history)
                transaction_session.commit()
                transaction_session.refresh(chat_history)
            return chat_history.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to chat history table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all chat history record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all chat history records]
        """
        try:
            logger.info("Inside CRUD Chat History - read !")
            with session() as transaction_session:
                obj: ChatHistory = transaction_session.query(ChatHistory).all()
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting data from chat history table",
                e.args,
                501,
            )

    def get_by_id(self, id: int):
        """[CRUD function to read a chat history record]

        Args:
            id (str): [id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [chat history record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Chat History - get by id !")
            with session() as transaction_session:
                obj: ChatHistory = (
                    transaction_session.query(ChatHistory)
                    .filter(ChatHistory.id == id)
                    .first()
                )
            if obj is not None:
                return obj.__dict__
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from chat history table",
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a chat history record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Chat History - update !")
            with session() as transaction_session:
                obj: ChatHistory = (
                    transaction_session.query(ChatHistory)
                    .filter(ChatHistory.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()
            return {"message": "Chat History table updated"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to chat history table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a chat history record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Chat History - delete !")
            with session() as transaction_session:
                obj: ChatHistory = (
                    transaction_session.query(ChatHistory)
                    .filter(ChatHistory.id == id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from chat history table",
                e.args,
                501,
            )
