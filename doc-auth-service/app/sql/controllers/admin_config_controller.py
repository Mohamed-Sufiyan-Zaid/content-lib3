from app.sql.crud.admin_config_crud import CRUDAdminConfig
from .domain_controller import CRUDDomain,CRUDSubDomain,DomainController
from app.sql.schemas.requests.DomainRequest import DomainRequest
from app.sql.schemas.requests.SubDomainRequest import SubDomainRequest


class AdminConfigController:
    def __init__(self):
        self.CRUDAdminConfig = CRUDAdminConfig()
        self.CRUDDomain = CRUDDomain()
        self.CRUDSubDomain = CRUDSubDomain()
        self.DomainController = DomainController()

    def get_all_admin_config_controller(self):
        """[Controller to get all admin configs]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [list]: [list of all the  admin configs in the system]
        """
        return self.CRUDAdminConfig.read_all()

    def create_admin_config_controller(self, request):
        """[Controller to register new config]

        Args:
            domain_details ([dict]): [create new config request]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [admin config obj with id]
        """
        domain_req = DomainRequest(name=request.domain_name)
        domain_obj = DomainController.create_domain_controller(self, request=domain_req)
        sub_domain_req = SubDomainRequest(
            name=request.sub_domain_name, domain_id=domain_obj["id"]
        )
        sub_domain_obj = DomainController.create_subdomain_controller(
            self, request=sub_domain_req
        )
        config_req = {
            "domain_id": domain_obj["id"],
            "sub_domain_id": sub_domain_obj["id"],
        }
        return self.CRUDAdminConfig.create(**config_req)

    def update_admin_config_controller(self, admin_config_id, request):
        """[Controller to register new config]

        Args:
            request ([dict]): [create new config request]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [admin config obj with id]
        """
        domain_req = DomainRequest(name=request.domain_name)
        domain_obj = DomainController.create_domain_controller(self, request=domain_req)
        sub_domain_req = SubDomainRequest(
            name=request.sub_domain_name, domain_id=domain_obj["id"]
        )
        sub_domain_obj = DomainController.create_subdomain_controller(
            self, request=sub_domain_req
        )
        config_req = {
            "domain_id": domain_obj["id"],
            "sub_domain_id": sub_domain_obj["id"],
        }
        return self.CRUDAdminConfig.update(admin_config_id, config_req)

    def delete_config_controller(self, id: int):
        """[Delete config Details]

        Args:
            id (str): [id of the config]

        Returns:
            Successfully deleted
        """
        return self.CRUDAdminConfig.delete(id=id)
