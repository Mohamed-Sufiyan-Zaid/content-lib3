from app.sql import session
from app.sql.orm_models.domain_config_model import SubDomain
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger


class CRUDSubDomain:
    def create(self, **kwargs):
        """[CRUD function to create a new sub_domain record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Sub domain - create !")
            sub_domain = SubDomain(**kwargs)
            with session() as transaction_session:
                transaction_session.add(sub_domain)
                transaction_session.commit()
                transaction_session.refresh(sub_domain)
            return sub_domain.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to subdomain table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all sub_domains record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all sub_domain records]
        """
        try:
            logger.info("Inside CRUD Sub domain - read !")
            with session() as transaction_session:
                obj: SubDomain = transaction_session.query(SubDomain).all()
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting data from subdomain table",
                e.args,
                501,
            )

    def get_by_name(self, name: str, domain_id: int):
        """[CRUD function to read a domain record]

        Args:
            domain_name (str): [domain name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [domain record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Sub domain - get by id !")
            with session() as transaction_session:
                obj: SubDomain = (
                    transaction_session.query(SubDomain)
                    .filter(SubDomain.name == name)
                    .filter(SubDomain.domain_id == domain_id)
                    .first()
                )
            if obj is not None:
                return obj.__dict__
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from subdomain table",
                e.args,
                501,
            )

    def get_by_domain_id(self, domain_id: int):
        """[CRUD function to read a subdomain record]

        Args:
            domain_id (str): [domain id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [subdomain record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Sub domain - get by domain id !")
            with session() as transaction_session:
                obj: SubDomain = (
                    transaction_session.query(SubDomain)
                    .filter(SubDomain.domain_id == domain_id)
                    .all()
                )
            if obj is not None:
                return obj
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by domain id from subdomain table",
                e.args,
                501,
            )

    def get_by_id(self, id: int, domain_id: int):
        """[CRUD function to read a domain record]

        Args:
            domain_name (str): [domain name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [domain record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Sub domain - get by id !")
            with session() as transaction_session:
                obj: SubDomain = (
                    transaction_session.query(SubDomain)
                    .filter(SubDomain.id == id)
                    .filter(SubDomain.domain_id == domain_id)
                    .first()
                )
            if obj is not None:
                return obj.__dict__
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry by name from subdomain table",
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a sub_domain record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Sub domain - update !")
            with session() as transaction_session:
                obj: SubDomain = (
                    transaction_session.query(SubDomain)
                    .filter(SubDomain.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to subdomain table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a sub_domain record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Sub domain - delete !")
            with session() as transaction_session:
                obj: SubDomain = (
                    transaction_session.query(SubDomain)
                    .filter(SubDomain.id == id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from subdomain table",
                e.args,
                501,
            )
