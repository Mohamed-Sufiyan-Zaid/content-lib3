from app.sql.crud.project_crud import CRUDProject
from app.sql.crud.admin_config_crud import CRUDAdminConfig
from app.sql.schemas.requests.AdminConfigRequest import AdminConfigRequest
from .admin_config_controller import AdminConfigController, CRUDDomain, CRUDSubDomain
from app.sql.utils.exceptions import ResourceNotFound, BadRequestResult
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger
from datetime import datetime


class ProjectController:
    def __init__(self):
        self.CRUDAdminConfig = CRUDAdminConfig()
        self.CRUDProject = CRUDProject()
        self.CRUDDomain = CRUDDomain()
        self.CRUDSubDomain = CRUDSubDomain()
        self.AdminConfigController = AdminConfigController()

    def get_domain_config(self, project):
        logger.info("Inside project domain config!")
        admin_config = self.CRUDAdminConfig.get_by_id(id=project["admin_config_id"])
        domain_config = self.CRUDDomain.get_by_id(id=admin_config["domain_id"])
        subdomain_config = self.CRUDSubDomain.get_by_id(
            id=admin_config["sub_domain_id"], domain_id=admin_config["domain_id"]
        )

        return {
            "domain_name": domain_config["name"],
            "sub_domain_name": subdomain_config["name"],
        }

    def get_all_project_controller(self):
        logger.info("Inside project get all!")
        """[Controller to get all projects]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [list]: [list of all the  projects in the system]
        """
        return self.CRUDProject.read_all()

    def get_projects_ntid_controller(self, ntid):
        """[Controller to get all projects]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [list]: [list of all the  projects in the system]
        """
        try:
            logger.info("Inside project get by ntid!")
            project_list = self.CRUDProject.get_all_by_ntid(ntid.upper())
            if not len(project_list):
                return []

            response_list = []
            for project_item in project_list:
                domain_config = self.get_domain_config(project=project_item)
                response_obj = {
                    "ntid": project_item["ntid"],
                    "project_id": project_item["id"],
                    "project_name": project_item["project_name"],
                    "domain_name": domain_config["domain_name"],
                    "sub_domain_name": domain_config["sub_domain_name"],
                    "version": project_item["version"],
                    "last_modified_by": project_item["last_modified_by"],
                    "group_name": project_item["group_name"],
                }
                response_list.append(response_obj)
            return response_list
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while fetching projects in controller", e.args, 501
            )

    def create_project_controller(self, request):
        """[Controller to register new config]

        Args:
            request ([dict]): [create new config request]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [admin config obj with id]
        """
        try:
            logger.info("Inside create project!")
            config_req = {}
            admin_config_req = AdminConfigRequest(
                domain_name=request.domain_name.lower(),
                sub_domain_name=request.sub_domain_name.lower(),
            )
            admin_config_obj = AdminConfigController.create_admin_config_controller(
                self, request=admin_config_req
            )
            admin_config_id = admin_config_obj["id"]

            config_req = {
                "ntid": request.ntid.upper(),
                "admin_config_id": admin_config_id,
                "project_name": request.project_name.lower(),
                "group_name": request.group_name,
            }

            if len(request.project_name) == 0:
                message = "Project name can not be empty!"
                raise BadRequestResult(message)

            project_obj = self.CRUDProject.get_by_name(
                name=request.project_name.lower(), ntid=request.ntid.upper()
            )
            if project_obj is not None:
                message = "Project with the same name does already exist!"
                raise BadRequestResult(message)

            response_obj = self.CRUDProject.create(**config_req)

            domain_config = self.get_domain_config({"admin_config_id": admin_config_id})
            response_obj.update(
                {
                    "domain_name": domain_config["domain_name"],
                    "sub_domain_name": domain_config["sub_domain_name"],
                }
            )
            response_obj.pop("admin_config_id")
            return response_obj
        except BadRequestResult as e:
            logger.error(e)
            return get_err_json_response(e.args, e.args, 400)
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while creating projects in controller", e.args, 501
            )

    def update_project_controller(self, request):
        """[Get project Details]

        Args:
            projectname (str): [projectname of the project]

        Returns:
            [dict]: [project details]
        """
        try:
            logger.info("Inside update project!")
            project_obj = self.CRUDProject.get_by_project_id(id=request.project_id)
            if project_obj is None:
                raise ResourceNotFound(f"Project id: {request.project_id}")

            domain_config = self.get_domain_config(project=project_obj)
            admin_config_id = project_obj["admin_config_id"]

            if not (
                domain_config["domain_name"] == request.domain_name.lower()
                and domain_config["sub_domain_name"] == request.sub_domain_name.lower()
            ):
                admin_config_req = AdminConfigRequest(
                    domain_name=request.domain_name.lower(),
                    sub_domain_name=request.sub_domain_name.lower(),
                )
                admin_config_obj = AdminConfigController.update_admin_config_controller(
                    self,
                    admin_config_id=project_obj["admin_config_id"],
                    request=admin_config_req,
                )

            config_req = {
                "id": request.project_id,
                "ntid": request.ntid.upper(),
                "admin_config_id": admin_config_id,
                "project_name": request.project_name.lower(),
                "group_name": request.group_name,
                "last_modified_by": datetime.now(),
                "version": project_obj["version"] + 1,
            }

            response_obj = self.CRUDProject.update(**config_req)

            response_obj.update(config_req)
            domain_config = self.get_domain_config(project=project_obj)
            response_obj.update(
                {
                    "project_id": request.project_id,
                    "domain_name": domain_config["domain_name"],
                    "sub_domain_name": domain_config["sub_domain_name"],
                }
            )
            response_obj.pop("admin_config_id")
            return response_obj
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response("Projects does not exist!", e.args, 404)
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating project in controller", e.args, 501
            )

    def delete_project_controller(self, project_id):
        """[Delete project Details]

        Args:
            project_id (int): [project_id ]

        Returns:
            [dict]: [project details]
        """
        try:
            logger.info("Inside delete project!")
            project_obj = self.CRUDProject.get_by_project_id(id=project_id)

            if project_obj is None:
                raise ResourceNotFound(f"Project id: {project_id}")

            project_id = project_obj["id"]
            admin_config_id = project_obj["admin_config_id"]
            
            project_deleted = self.CRUDProject.delete(id=project_id)
            project_deleted.update({"project_id": project_id})
            return project_deleted
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response("Projects does not exist!", e.args, 404)
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting project in controller", e.args, 501
            )

    def get_project_by_id(self, project_id: int):
        """[Controller to get project by id]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            dict: project record for project id in the system
        """
        project_obj = self.CRUDProject.get_by_project_id(id=project_id)
        domain_config = self.get_domain_config(project=project_obj)
        project_obj.update(
            {
                "domain_name": domain_config["domain_name"],
                "sub_domain_name": domain_config["sub_domain_name"],
            }
        )
        return project_obj