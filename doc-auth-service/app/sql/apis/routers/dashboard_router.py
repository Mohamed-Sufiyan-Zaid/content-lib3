from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.metric_controller import MetricController
from app.sql.controllers.document_controller import DocumentController

dashboard_router = APIRouter(prefix=config["api_prefix"])


@dashboard_router.get("/dashboard/count")
async def fetch_metric():
    """[Get List of all project]

    Raises:
        error: [Error details]

    Returns:
        [str]: [Success response]
    """
    metric_obj = MetricController().fetch_metric()
    return metric_obj


@dashboard_router.get("/dashboard/stats")
async def get_dashboard_stats(project_id: int):
    """[Get dashboard stats by project id]

    Raises:
        error: [Error details]

    Returns:
        dict: dashboard stats
    """
    return DocumentController().get_dashboard_stats(project_id)
