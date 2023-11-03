from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.user_controller import UserController
from ...schemas.requests.UserRequest import UserDetails

user_detail_router = APIRouter(prefix=config["api_prefix"])


@user_detail_router.post("/user/register")
async def create_user(create_user_request: UserDetails):
    """[API router to create new user into the system]

    Args:
        create_user_request (create): [New user details]

    Raises:
        HTTPException: [Unauthorized exception when invalid token is passed]
        error: [Exception in underlying controller]

    Returns:
        [createResponse]: [create new user response]
    """
    user_obj = UserController().create_user_controller(create_user_request)
    return user_obj


@user_detail_router.get("/get-all-user")
async def get_all_users():
    """[Get List of all users]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of users]
    """
    list_of_users = UserController().get_all_user_controller()
    return list_of_users
