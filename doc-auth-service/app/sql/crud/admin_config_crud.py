from app.sql import session
from app.sql.orm_models.admin_config_model import AdminConfig
from app.sql.utils.logs.logger_config import logger
from app.commons.errors import get_err_json_response


class CRUDAdminConfig:
    def create(self, **kwargs):
        """[CRUD function to create a new admin_config record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Admin - create !")
            admin_config = AdminConfig(**kwargs)
            with session() as transaction_session:
                transaction_session.add(admin_config)
                transaction_session.commit()
                transaction_session.refresh(admin_config)
            return admin_config.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to admin config table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all admin_configs record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all admin_config records]
        """
        try:
            logger.info("Inside CRUD Admin - read !")
            with session() as transaction_session:
                obj: AdminConfig = transaction_session.query(AdminConfig).all()
            if obj is not None:
                return [row.__dict__ for row in obj]
            else:
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from admin config table",
                e.args,
                501,
            )

    def get_by_id(self, **kwargs):
        """[CRUD function to read a admin_config record by display]

        Args:
            admin_config_name (str): [admin_config name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [admin_config record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Admin - get by id !")
            with session() as transaction_session:
                obj: AdminConfig = (
                    transaction_session.query(AdminConfig)
                    .filter(AdminConfig.id == kwargs.get("id"))
                    .first()
                )
                if obj is not None:
                    return obj.__dict__
                else:
                    return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting data from admin config table",
                e.args,
                501,
            )

    def update(self, admin_config_id, request):
        """[CRUD function to update a AdminConfig record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Admin - update !")
            with session() as transaction_session:
                obj: AdminConfig = (
                    transaction_session.query(AdminConfig)
                    .filter(AdminConfig.id == admin_config_id)
                    .update(request, synchronize_session=False)
                )
                transaction_session.commit()
            return {"message": "AdminConfig table updated"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to AdminConfig table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a admin_config record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Admin - delete !")
            with session() as transaction_session:
                obj: AdminConfig = (
                    transaction_session.query(AdminConfig)
                    .filter(AdminConfig.id == id)
                    .first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
                return {"Message": "Config deleted successfully!"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from admin config table",
                e.args,
                501,
            )
