from app.sql.crud.metric_crud import CRUDMetric
from app.sql.utils.logs.logger_config import logger


class MetricController:
    def __init__(self):
        self.CRUDMetric = CRUDMetric()

    def fetch_metric(self):
        """[Controller to get total counts of projects, domains and subdomains]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [Dictionary containing the total counts of projects, domains and subdomains]
        """
        logger.info("Inside fetch metric!")
        return self.CRUDMetric.fetch_metric()
