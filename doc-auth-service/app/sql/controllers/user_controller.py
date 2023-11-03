from app.sql.crud.user_crud import CRUDUser


class UserController:
    def __init__(self):
        self.CRUDUser = CRUDUser()

    def get_all_user_controller(self):
        """[Controller to get all admin configs]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [list]: [list of all the  admin configs in the system]
        """
        return self.CRUDUser.read_all()

    def create_user_controller(self, request):
        """[Controller to register new config]

        Args:
            request ([dict]): [create new config request]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [authorization details]
        """
        user = self.CRUDUser.get_by_name(user_name=request.user_name)
        if user is not None:
            return {"status": "user already exists", "user_id": user["user_id"]}
        user_request = {"user_name": request.user_name, "user_type": request.user_type}
        return self.CRUDUser.create(**user_request)

    def delete_config_controller(self, id: int):
        """[Get config Details]

        Args:
            configname (str): [configname of the config]

        Returns:
            [dict]: [config details]
        """
        return self.CRUDUser.delete(id=id)
