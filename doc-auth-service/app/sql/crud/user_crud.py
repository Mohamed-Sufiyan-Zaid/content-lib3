from app.sql import session
from app.sql.orm_models.admin_config_model import User


class CRUDUser:
    def create(self, **kwargs):
        """[CRUD function to create a new user record]

        Raises:
            error: [Error returned from the DB layer]
        """
        user = User(**kwargs)
        with session() as transaction_session:
            transaction_session.add(user)
            transaction_session.commit()
            transaction_session.refresh(user)
        return user.__dict__

    def read_all(self):
        """[CRUD function to read_all users record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [list]: [all user records]
        """

        with session() as transaction_session:
            obj: User = transaction_session.query(User).all()
        if obj is not None:
            return [row.__dict__ for row in obj]
        else:
            return []

    def get_by_name(self, user_name: str):
        """[CRUD function to read a user record]

        Args:
            user_name (str): [user name to filter the record]

        Raises:
            error: [Error returned from the DB layer]

        Returns:
            [dict]: [user record matching the criteria]
        """
        with session() as transaction_session:
            obj: User = (
                transaction_session.query(User)
                .filter(User.user_name == user_name)
                .first()
            )
            if obj is not None:
                return obj.__dict__
            else:
                return None

    def update(self, **kwargs):
        """[CRUD function to update a user record]

        Raises:
            error: [Error returned from the DB layer]
        """

        with session() as transaction_session:
            obj: User = (
                transaction_session.query(User)
                .filter(User.user_id == kwargs.get("user_id"))
                .update(kwargs, synchronize_session=False)
            )
            transaction_session.commit()
        return obj.__dict__

    def delete(self, user_id: int):
        """[CRUD function to delete a user record]

        Raises:
            error: [Error returned from the DB layer]
        """

        with session() as transaction_session:
            obj: User = (
                transaction_session.query(User).filter(User.user_id == user_id).first()
            )
            transaction_session.delete(obj)
            transaction_session.commit()
        return obj.__dict__
