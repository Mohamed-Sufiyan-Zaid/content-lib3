"""Exceptions with error codes implemented."""


class BadRequestResult(Exception):
    """Class for BadRequestResult."""

    def __init__(
        self,
        description: str = "The request payload is invalid and does not adhere to specification",
    ) -> None:
        """Init constructor for BadRequestResult"""
        super().__init__(description)


class InternalServerError(Exception):
    """Class for InternalServerErrorResult."""

    def __init__(
        self,
        description: str = "The request processing has failed because of an internal error, exception or failure.",
    ) -> None:
        """Init constructor for InternalServerErrorResult"""
        super().__init__(description)


class ResourceNotFound(Exception):
    """Class for ResourceNotFound Request."""

    def __init__(
        self,
        description: str = "The request processing has failed because of missing resource.",
    ) -> None:
        """Init constructor for ResourceNotFound Request"""
        super().__init__(description)
