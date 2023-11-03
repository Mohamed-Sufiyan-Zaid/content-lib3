from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.project_controller import ProjectController
from app.sql.schemas.requests.ProjectRequest import ProjectRequest, UpdateProjectRequest

project_router = APIRouter(prefix=config["api_prefix"])


@project_router.post("/project")
async def create_project(create_project_request: ProjectRequest):
    """[API router to create new project into the system]

    Args:
        create_project_request (create): [New project details]

    Raises:
        HTTPException: [Unauthorized exception when invalid token is passed]
        error: [Exception in underlying controller]

    Returns:
        [createResponse]: [create new project response]
    """
    project_obj = ProjectController().create_project_controller(create_project_request)
    return project_obj


@project_router.get("/project/mine")
async def get_ntid_projects(ntid: str):
    """[Get List of all projects]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of projects]
    """
    list_of_projects = ProjectController().get_projects_ntid_controller(ntid)
    return list_of_projects


@project_router.get("/all-project", include_in_schema=False)
async def get_all_projects():
    """[Get List of all projects]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of projects]
    """
    list_of_projects = ProjectController().get_all_project_controller()
    return list_of_projects


@project_router.put("/project")
async def update_project(create_project_request: UpdateProjectRequest):
    """[Update project by project name]

    Raises:
        error: [Error details]

    Returns:
        [str]: [Success response]
    """
    project_obj = ProjectController().update_project_controller(create_project_request)
    return project_obj


@project_router.delete("/project")
async def delete_project(project_id: int):
    """[Get List of all project]

    Raises:
        error: [Error details]

    Returns:
        [str]: [Success response]
    """
    project_obj = ProjectController().delete_project_controller(project_id)
    return project_obj

@project_router.get("/project/{project_id}")
async def get_project_by_id(project_id: int):
    """[Get project details by id]

    Raises:
        error: [Error details]

    Returns:
        [str]: [Success response]
    """
    project_obj = ProjectController().get_project_by_id(project_id)
    return project_obj