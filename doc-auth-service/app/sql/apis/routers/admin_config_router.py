from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.admin_config_controller import AdminConfigController
from app.sql.schemas.requests.AdminConfigRequest import AdminConfigRequest

admin_config_router = APIRouter(prefix=config["api_prefix"])


@admin_config_router.get("/admin-config")
async def get_all_admin_configs():
    """[Get List of all admin_configs]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of AdminConfigs]
    """
    list_of_admin_configs = AdminConfigController().get_all_admin_config_controller()
    return list_of_admin_configs
