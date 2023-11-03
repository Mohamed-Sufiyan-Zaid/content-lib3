from app.sql import session
from app.sql.orm_models.domain_config_model import Domain
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger


class CRUDDomain:
    def create(self, **kwargs):
        """[CRUD function to create a new User record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Domain - create !")
            obj = Domain(**kwargs)
            with session() as transaction_session:
                transaction_session.add(obj)
                transaction_session.commit()
                transaction_session.refresh(obj)
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to domain table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all Users record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all user records]
        """
        try:
            logger.info("Inside CRUD Domain - read !")
            with session() as transaction_session:
                obj: Domain = transaction_session.query(Domain).all()
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from domain table",
                e.args,
                501,
            )

    def get_by_name(self, name: str):
        """[CRUD function to read a domain record]

        Args:
            domain_name (str): [domain name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [domain record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Domain - get by name !")
            with session() as transaction_session:
                obj: Domain = (
                    transaction_session.query(Domain)
                    .filter(Domain.name == name)
                    .first()
                )
            if obj is not None:
                return obj.__dict__
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting by name from domain table",
                e.args,
                501,
            )

    def get_by_id(self, id: int):
        """[CRUD function to read a domain record]

        Args:
            domain_name (str): [domain name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [domain record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Domain - get by id !")
            with session() as transaction_session:
                obj: Domain = (
                    transaction_session.query(Domain).filter(Domain.id == id).first()
                )
            if obj is not None:
                return obj.__dict__
            else:
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting by name from domain table",
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a User record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Domain - update !")
            with session() as transaction_session:
                obj: Domain = (
                    transaction_session.query(Domain)
                    .filter(Domain.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to domain table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a User record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Domain - delete !")
            with session() as transaction_session:
                obj: Domain = (
                    transaction_session.query(Domain).filter(Domain.id == id).first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            return obj.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from domain table",
                e.args,
                501,
            )
