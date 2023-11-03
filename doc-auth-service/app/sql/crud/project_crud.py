from app.sql import session
from sqlalchemy import and_
from app.sql.orm_models.project_model import Project
from app.commons.errors import get_err_json_response
from app.sql.utils.exceptions import ResourceNotFound
from app.sql.utils.logs.logger_config import logger


class CRUDProject:
    def create(self, **kwargs):
        """[CRUD function to create a new project record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Project - create !")
            projects = Project(**kwargs)
            with session() as transaction_session:
                transaction_session.add(projects)
                transaction_session.commit()
                transaction_session.refresh(projects)
            logger.info("Created a new record")
            return projects.__dict__
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while adding to project table",
                e.args,
                501,
            )

    def read_all(self):
        """[CRUD function to read_all projects record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all project records]
        """
        try:
            logger.info("Inside CRUD Project - read !")
            with session() as transaction_session:
                obj: Project = transaction_session.query(Project).order_by(Project.last_modified_by.desc()).all()
            if obj is not None:
                logger.info("fetching all the project records")
                return [row.__dict__ for row in obj]
            else:
                logger.info("No project record found")
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from project table",
                e.args,
                501,
            )

    def get_all_by_ntid(self, ntid):
        """[CRUD function to read_all projects record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all project records]
        """
        try:
            logger.info("Inside CRUD Project - get by ntid !")
            with session() as transaction_session:
                obj: Project = (
                    transaction_session.query(Project)
                    .filter(Project.ntid == ntid)
                    .order_by(Project.last_modified_by.desc())
                    .all()
                )
            if obj is not None:
                logger.info("fetching project record using ntid")
                return [row.__dict__ for row in obj]
            else:
                logger.info(f"no project record found for ntid {ntid}")
                return []
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while reading from project table by ntid.",
                e.args,
                501,
            )

    def get_by_id(self, id: int, ntid: str):
        """[CRUD function to read a project record with ntid id and project id]

        Args:
            project_id (str): [project id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [project record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Project - get by id !")
            with session() as transaction_session:
                obj: Project = (
                    transaction_session.query(Project)
                    .filter(and_(Project.id == id, Project.ntid == ntid))
                    .first()
                )
            if obj is not None:
                logger.info("fetching project record using id")
                return obj.__dict__
            else:
                logger.info(f"no project record found for id {id}")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry from project table",
                e.args,
                501,
            )

    def get_by_project_id(self, id: int):
        """[CRUD function to read a project record with ntid id and project id]

        Args:
            project_id (str): [project id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [project record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Project - get by project id !")
            with session() as transaction_session:
                obj: Project = (
                    transaction_session.query(Project).filter(Project.id == id).first()
                )
            if obj is not None:
                logger.info("fetching project record using id")
                return obj.__dict__
            else:
                logger.info(f"no project record found for id {id}")
                raise ResourceNotFound
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                f"Project with {id} does not exist! ",
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry from project table by project id.",
                e.args,
                501,
            )

    def get_by_name(self, name: str, ntid: str):
        """[CRUD function to read a project record with ntid id and project id]

        Args:
            project_id (str): [project id to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [project record matching the criteria]
        """
        try:
            logger.info("Inside CRUD Project - get by name !")
            with session() as transaction_session:
                obj: Project = (
                    transaction_session.query(Project)
                    .filter(and_(Project.project_name == name, Project.ntid == ntid))
                    .first()
                )
            if obj is not None:
                logger.info("fetching project record using name")
                return obj.__dict__
            else:
                logger.info(f"no project record found for name {name}")
                return None
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while getting an entry from project table by name.",
                e.args,
                501,
            )

    def update(self, **kwargs):
        """[CRUD function to update a project record]

        Raises:
            error: [Error returned from the DB layer]
        """

        try:
            logger.info("Inside CRUD Project - update !")
            with session() as transaction_session:
                obj: Project = (
                    transaction_session.query(Project)
                    .filter(Project.id == kwargs.get("id"))
                    .update(kwargs, synchronize_session=False)
                )
                transaction_session.commit()

                logger.info("Updated Project record")

            return {"message": "Project successfully updated!"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while updating to project table",
                e.args,
                501,
            )

    def delete(self, id: int):
        """[CRUD function to delete a project record]

        Raises:
            error: [Error returned from the DB layer]
        """
        try:
            logger.info("Inside CRUD Project - delete !")
            with session() as transaction_session:
                obj: Project = (
                    transaction_session.query(Project).filter(Project.id == id).first()
                )
                transaction_session.delete(obj)
                transaction_session.commit()
            logger.info(f"deleted a project record for id {id}")
            return {"Message": "Project deleted successfully!"}
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error while deleting from project table",
                e.args,
                501,
            )
