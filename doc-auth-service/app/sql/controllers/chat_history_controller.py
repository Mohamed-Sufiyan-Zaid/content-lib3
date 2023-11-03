from app.sql.crud.chat_history_crud import CRUDChatHistory
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger
from app.sql.utils.exceptions import BadRequestResult, ResourceNotFound


class ChatHistoryController:
    def __init__(self):
        self.CRUDChatHistory = CRUDChatHistory()

    def fetch_chat_history(self, id):
        """[Controller to get chat history]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [List]: [List containing the chat history dict]
        """
        try:
            logger.info("Inside fetch chat history!")
            chat_obj = self.CRUDChatHistory.get_by_id(id)
            if chat_obj is None:
                raise ResourceNotFound(f"Chat id : {id} does not exist!")
            chat_history = chat_obj["chat_history"]
            sorted_chat_history = sorted(chat_history, key=lambda item : item["counter"])
            return sorted_chat_history

        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                501,
            )

    def update_chat_history(self, id, chat_history_req):
        """[Controller to update chat history]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [List]: [List containing the chat history dict]
        """
        try:
            logger.info("Inside update chat history!")
            chat_obj = self.CRUDChatHistory.get_by_id(id)
            if chat_obj is None:
                raise ResourceNotFound(f"Chat id : {id} does not exist!")
            chat_history_list = []
            for counter, chat_history_obj in enumerate(chat_history_req.chat_history):
                chat_history_obj["counter"] = counter+1
                chat_history_list.append(chat_history_obj)
            update_req = {"id": id, "chat_history": chat_history_list}
            update_res = self.CRUDChatHistory.update(**update_req)
            return update_res

        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                501,
            )
