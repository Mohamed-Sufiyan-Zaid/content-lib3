from app.sql.crud.document_crud import CRUDDocument
from app.sql.crud.project_crud import CRUDProject
from app.sql.crud.template_crud import CRUDTemplate
from app.sql.crud.domain_crud import CRUDDomain
from app.sql.crud.admin_config_crud import CRUDAdminConfig
from app.sql.crud.subdomain_crud import CRUDSubDomain
from app.sql.crud.template_placeholder_crud import CRUDTemplatePlaceholder
from app.sql.crud.doc_placeholder_crud import CRUDDocPlaceholder
from app.sql.controllers.template_controller import TemplateController
from app.sql.utils.aws.s3 import (
    upload_to_s3,
    delete_file_from_s3,
    download_file,
    read_a_file,
    copy_file_s3,
)
from app.commons.errors import get_err_json_response
from app.sql.utils.logs.logger_config import logger
from app.sql.utils.exceptions import BadRequestResult, ResourceNotFound
from fastapi.responses import Response


class DocumentController:
    def __init__(self):
        self.CRUDDocument = CRUDDocument()
        self.CRUDProject = CRUDProject()
        self.CRUDTemplate = CRUDTemplate()
        self.CRUDAdminConfig = CRUDAdminConfig()
        self.CRUDDomain = CRUDDomain()
        self.CRUDSubDomain = CRUDSubDomain()
        self.CRUDTemplatePlaceholder = CRUDTemplatePlaceholder()
        self.CRUDDocPlaceholder = CRUDDocPlaceholder()

    def get_domain_config(self, admin_config_id):
        logger.info("Inside document domain config!")
        admin_config = self.CRUDAdminConfig.get_by_id(id=admin_config_id)
        domain_config = self.CRUDDomain.get_by_id(id=admin_config["domain_id"])
        subdomain_config = self.CRUDSubDomain.get_by_id(
            id=admin_config["sub_domain_id"], domain_id=admin_config["domain_id"]
        )

        return {
            "domain_name": domain_config["name"],
            "sub_domain_name": subdomain_config["name"],
        }

    def get_all_documents_controller(self):
        """[Controller to get all documents]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [list]: [list of all the documents in the system]
        """
        logger.info("Inside document get all!")
        list_of_documents = self.CRUDDocument.read_all()
        for document in list_of_documents:
            document.update(self.get_domain_config(document["admin_config_id"]))
        return list_of_documents

    def get_documents_by_ntid_controller(self, nt_id: str):
        """[Controller to get all documents by nt_id]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [list]: [list of all the documents by nt_id in the system]
        """
        logger.info("Inside document get bt ntid!")
        list_of_documents = self.CRUDDocument.read_all_documents_by_ntid(nt_id.upper())
        for document in list_of_documents:
            document.update(self.get_domain_config(document["admin_config_id"]))
        return list_of_documents

    def create_document_controller(self, request):
        """[Controller to register new document]

        Args:
            request ([dict]): [create new document request]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [authorization details]
        """
        logger.info("Inside create document !")
        try:
            if not request.doc_name:
                raise BadRequestResult("document name cannot be null")
            elif not request.project_id:
                raise BadRequestResult("project id cannot be null")
            elif not request.template_id:
                raise BadRequestResult("template id cannot be null")
        except BadRequestResult as e:
            logger.error(e)
            return get_err_json_response(
                f"Invalid request body ",
                e.args,
                400,
            )
        try:
            project_obj = self.CRUDProject.get_by_project_id(id=request.project_id)
            if project_obj is None:
                raise ResourceNotFound(
                    f"Project with id: {request.project_id} does not exists"
                )

            template_obj = self.CRUDTemplate.get_by_id(template_id=request.template_id)
            if template_obj is None:
                message = f"Template with id : {request.template_id} does not exist!"
                raise ResourceNotFound(message)

            doc_obj = self.CRUDDocument.get_by_name(name=request.doc_name)
            if doc_obj is not None:
                message = f"Document name : {request.doc_name}, Document with the same name does already exist!"
                raise BadRequestResult(message)
            ntid = request.doc_author.upper()
            # s3_bucket_path = copy_file_s3(template_obj["s3_bucket_path"], request.doc_name)
            # s3_bucket_path = ""
            request = request.dict()
            request["admin_config_id"] = project_obj["admin_config_id"]
            request["s3_bucket_path"] = template_obj["s3_bucket_path"]
            request["doc_author"] = ntid
            document = self.CRUDDocument.create(**request)
            document.update(self.get_domain_config(project_obj["admin_config_id"]))
            return document
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                501,
            )

    def delete_Document_controller(self, id: int):
        """[Delete Document Details]

        Args:
            id (int): [id of the Document]

        Returns:
            [Document deleted]
        """
        try:
            logger.info("Inside delete document !")
            document_obj = self.CRUDDocument.get_by_id(id=id)
            if document_obj is not None:
                # s3_bucket_path = delete_file_from_s3(
                # s3_path=document_obj["s3_bucket_path"]
                # )
                return self.CRUDDocument.delete(id=id)
            else:
                raise ResourceNotFound(f"Document id : {id} does not exist!")
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error occured in reading documnent by id.",
                e.args,
                501,
            )

    def read_by_id(self, id: int):
        """[Controller to get document by id]

        Args:
            id (int): [id of the Document]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            dict : document record

        TODO: review and make it common for template and document.
        """
        try:
            logger.info("Inside document get by id!")
            document = self.CRUDDocument.get_by_id(id)
            if document is not None:
                project_name = self.CRUDProject.get_by_project_id(
                    document["project_id"]
                )["project_name"]
                template_name = self.CRUDTemplate.get_by_id(document["template_id"])[
                    "template_name"
                ]
                document_placeholder = self.CRUDDocPlaceholder.get_by_doc_id(id)
                document.update(self.get_domain_config(document["admin_config_id"]))
                document.update(
                    {
                        "project_name": project_name,
                        "template_name": template_name,
                        "placeholder_count": len(document_placeholder),
                        "document_placeholder": document_placeholder,
                    }
                )
                return document
            else:
                raise ResourceNotFound(f"Document id : {id} does not exist!")
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error occured in reading documnent by id.",
                e.args,
                501,
            )

    def read_by_project_id(self, project_id: int):
        """[Controller to get document by project_id]

        Args:
            project_id (int): [project_id of the Document]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            dict : document record
        """

        try:
            logger.info("Inside document get by project id!")
            project_obj = self.CRUDProject.get_by_project_id(id=project_id)
            if project_obj is None:
                raise ResourceNotFound(f"Project with id: {project_id} does not exists")
            document = self.CRUDDocument.get_by_project_id(project_id)
            res_obj = []
            if document is not None:
                for doc in document:
                    doc.update(self.get_domain_config(doc["admin_config_id"]))
                    res_obj.append(doc)
                return res_obj
            else:
                raise ResourceNotFound(f"Document id : {id} does not exist!")
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error occured in reading documnent by id.",
                e.args,
                501,
            )

    def read_by_name(self, name: str):
        """[Controller to get document by name]

        Args:
            name (int): [name of the Document]

        Raises:
            error: [Error raised from controller layer]

        Returns:
            dict : document record
        """

        try:
            logger.info("Inside document get by name!")
            document = self.CRUDDocument.get_by_name(name)
            if document is not None:
                document.update(self.get_domain_config(document["admin_config_id"]))
                return document
            else:
                raise ResourceNotFound(f"Document name : {name} does not exist!")
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                "Error occured in reading documnent by id.",
                e.args,
                501,
            )

    def update_document_controller(self, document_id, request, html_file):
        """[Controller to update document by request]

        Args:
            request: {multiple values}

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [authorization details]
        """
        try:
            logger.info("Inside update document!")
            if not document_id:
                raise BadRequestResult("document id cannot be null")
            elif not request["doc_name"]:
                raise BadRequestResult("document name cannot be null")
        except BadRequestResult as e:
            logger.error(e)
            return get_err_json_response(
                f"Invalid request body ",
                e.args,
                400,
            )
        try:
            doc_obj = self.CRUDDocument.get_by_id(id=document_id)
            if doc_obj is None:
                message = f"Document with id : {document_id} does not exist!"
                raise ResourceNotFound(message)

            project_obj = self.CRUDProject.get_by_project_id(id=doc_obj["project_id"])
            if project_obj is None:
                raise ResourceNotFound(
                    f"Project with id: {doc_obj['project_id']} does not exists"
                )

            template_obj = self.CRUDTemplate.get_by_id(
                template_id=request["template_id"]
            )
            if template_obj is None:
                message = f"Template with id : {request['template_id']} does not exist!"
                raise ResourceNotFound(message)

            domain_config = self.get_domain_config(project_obj["admin_config_id"])
            # ntid = request["doc_author"].upper()
            # s3_bucket_path = TemplateController().upload_s3(
            #     request, doc_obj["project_id"], html_file
            # )
            # s3_bucket_path = upload_to_s3(
            #     file=html_file,
            #     domain_name=domain_config["domain_name"],
            #     subdomain_name=domain_config["sub_domain_name"],
            #     ntid=request["ntid"].upper(),
            #     file_name=html_file.filename,
            #     template_name=request["template_name"],
            # )
            s3_bucket_path = ""
            request["admin_config_id"] = project_obj["admin_config_id"]
            request["s3_bucket_path"] = s3_bucket_path
            request["id"] = document_id
            document = self.CRUDDocument.update(**request)
            document.update(self.get_domain_config(project_obj["admin_config_id"]))
            return document
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                501,
            )

    def get_dashboard_stats(self, project_id: int):
        """[Controller to fetth dashboard stats by project_id]

        Args:
            project_id: project_id of a document

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [dashboard stats]
        """
        logger.info("Inside dashboard stats!")
        return self.CRUDDocument.get_dashboard_stats(project_id)

    def file_data(self, request):
        """[Controller to fetch file content from s3]

        Args:
            request: request with s3 bucket path

        Raises:
            error: [Error raised from controller layer]

        Returns:
            [dict]: [response with file content stats]
        """
        try:
            logger.info("Inside read file data!")
            s3_path = request.s3_bucket_path
            html_content = read_a_file(s3_path)
            response_obj = {
                "html_text": html_content,
                "id": request.id,
                "file_name": request.file_name,
                "type": request.type,
                "s3_bucket_path": request.s3_bucket_path,
                "action": request.action,
            }
            return response_obj
        except Exception as err:
            logger.error(err)
            return get_err_json_response(
                "Error while reading file data from s3 in controller",
                err.args,
                501,
            )

    def download_file(self, id):
        try:
            logger.info("Inside document download!")
            doc_obj = self.CRUDDocument.get_by_id(id=id, get_s3=True)
            if doc_obj is None:
                message = f"Document with id : {id} does not exist!"
                raise ResourceNotFound(message)
            doc_name = doc_obj["doc_name"]
            s3_path = doc_obj["s3_bucket_path"]
            s3_sub_path = s3_path.split("documents")[-1]
            split_str = s3_sub_path.rsplit("/", 1)
            file_name = f"{doc_name}_{split_str[1].split('_')[1]}"
            file_content = download_file(s3_path)

            if file_content is not None:
                headers = {"Content-Disposition": f"attachment; filename={file_name}"}
                response = Response(
                    content=file_content,
                    media_type="application/octet-stream",
                    headers=headers,
                )
                return response
            else:
                raise BadRequestResult("Error while downloading file!")
        except BadRequestResult as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                400,
            )
        except ResourceNotFound as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                404,
            )
        except Exception as e:
            logger.error(e)
            return get_err_json_response(
                e.args,
                e.args,
                501,
            )
