import json
from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.chat_history_controller import ChatHistoryController
from app.sql.schemas.requests.ChatHistoryRequest import ChatHistoryRequest

chat_history_router = APIRouter(prefix=config["api_prefix"])


@chat_history_router.get("/chat-history/{id}")
async def fetch_chat_history(id: int):
    """[API router to fetch chat history by id]

    Args:
        id: chat id

    Raises:
        HTTPException: [Unauthorized exception when invalid token is passed]
        error: [Exception in underlying controller]

    Returns:
        [chat history][List]: [chat history response]
    """
    chat_history = ChatHistoryController().fetch_chat_history(id)

    return chat_history


@chat_history_router.post("/chat-history")
async def update_chat_history(id: int, chat_history_req: ChatHistoryRequest):
    """[API router to update chat history by id]

    Args:
        id: chat id
        chat_history_req (create): [prompt and content details]

    Raises:
        HTTPException: [Unauthorized exception when invalid token is passed]
        error: [Exception in underlying controller]

    Returns:
        [chat history][List]: [chat history response]
    """
    chat_history = ChatHistoryController().update_chat_history(id, chat_history_req)
    return chat_history
