from fastapi import APIRouter
from app.commons.load_config import config
from app.sql.controllers.domain_controller import DomainController

domain_router = APIRouter(prefix=config["api_prefix"])


@domain_router.get("/domains")
async def get_all_domains():
    """[Get List of all domains]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of domains]
    """
    list_of_domains = DomainController().get_all_domains_controller()
    return list_of_domains


@domain_router.get("/sub-domains")
async def get_all_subdomains(domain_id: int):
    """[Get List of all subdomains]

    Raises:
        error: [Error details]

    Returns:
        [list]: [List of subdomains]
    """
    list_of_sub_domains = DomainController().get_all_subdomains_controller(domain_id)
    return list_of_sub_domains
