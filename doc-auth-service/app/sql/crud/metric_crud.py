from app.sql import session
from app.sql.orm_models.project_model import Project
from app.sql.orm_models.domain_config_model import Domain, SubDomain
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger


class CRUDMetric:
    def fetch_metric(self):
        """[CRUD function to retrieve the total counts of projects, domains and subdomains ]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [Dictionary containing the total counts of projects, domains and subdomains]
        """
        try:
            logger.info("Inside CRUD Metric - fetch !")
            logger.info("Get Metric details.")
            projects, domains, subdomains, groups = 0, 0, 0, 1
            with session() as transaction_session:
                projects: int = transaction_session.query(Project).count()
                domains: int = transaction_session.query(Domain).count()
                subdomains: int = transaction_session.query(SubDomain).count()

            # Create dictionary with counts
            counts = {
                "project_total_count": projects,
                "group_total_count": groups,
                "domain_total_count": domains,
                "subdomain_total_count": subdomains,
            }
            return counts
        except Exception as e:
            logger.error(f"Metric CRUD function error message: {e} ")
            return get_err_json_response(
                "Error while fetching metric info.",
                e.args,
                501,
            )
