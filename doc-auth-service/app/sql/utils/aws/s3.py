import os
from fastapi import UploadFile
import boto3
from app.commons.errors import get_err_json_response
from dotenv import load_dotenv
from app.sql.utils.logs.logger_config import logger
import io

load_dotenv()


def upload_to_s3(
    file: UploadFile,
    domain_name: str,
    subdomain_name: str,
    ntid: str,
    file_name: str,
    template_name: str,
    isTemplate: bool = True
):
    """Uploads file in the S3 bucket. The bucket name is configured in
    the environment variables.

    Args:
        file: actual local file
        domain_name (str): domain name
        subdomain_name (str): subdomain name
        ntid (str): group ntid or reference id
        file_name (str): file name

    Returns:
        Any: returns S3 Path.
        Otherwise returns BadRequest/InternalServerError response in case of failure
    """
    client = boto3.client("s3")
    try:
        logger.info("Inside s3 upload!")
        bucket_name: str = os.getenv("S3_BUCKET_NAME", "null")

        if isTemplate:
            file_path: str = f"templates/{domain_name}/{subdomain_name}/{ntid}/{template_name}_{file_name}"
        else: 
            file_path: str = f"documents/{domain_name}/{subdomain_name}/{ntid}/{template_name}_{file_name}"

        file_path = file_path.replace(" ", "_")
        
        file_content = file.file.read()

        # upload doc
        client.put_object(Body=file_content, Bucket=bucket_name, Key=file_path)
        body = {"s3Path": f"s3://{bucket_name}/{file_path}"}

        return body  # 200 success response

    except client.exceptions.NoSuchBucket as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            404,
        )  # 400 bad request response
    except client.exceptions.ClientError as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            400,
        )

    except Exception as err:
        logger.error(err)
        return get_err_json_response(
            str(err),
            err.args,
            501,
        )


def delete_file_from_s3(
    s3_path: str,
):
    """Deletes a file from S3.

    Args:
        domain_name (str): domain name
        subdomain_name (str): subdomain name
        ntid (str): group ntid or reference id
        file_name (str): template name

    Returns:
        Success message.
        Otherwise returns BadRequest/InternalServerError response in case of failure
    """

    client = boto3.client("s3")

    try:
        logger.info("Inside s3 delete!")
        bucket_name: str = os.getenv("S3_BUCKET_NAME", "null")
        file_name = "/".join(s3_path.split("/")[3:])
        client.delete_object(Bucket=bucket_name, Key=file_name)
        return {"message": "File successfully deleted!"}  # 200 success response
    except client.exceptions.NoSuchBucket as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            404,
        )  # 400 bad request response
    except client.exceptions.ClientError as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            400,
        )

    except Exception as err:
        logger.error(err)
        return get_err_json_response(
            str(err),
            err.args,
            501,
        )


def download_file(s3_path: str):
    """Downloads the file mentioned in the path from an AWS S3 bucket

    Args:
        s3_path: bucket path

    Returns:
        Dict[str, Any]: JSON like Python Dict object
    """
    client = boto3.client("s3")
    try:
        logger.info("Inside s3 downlaod!")
        bucket_name: str = os.getenv("S3_BUCKET_NAME", "null")
        file_name = "/".join(s3_path.split("/")[3:])
        response = client.get_object(Bucket=bucket_name, Key=file_name)
        return response["Body"].read()

    except client.exceptions.NoSuchBucket as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            404,
        )  # 400 bad request response
    except client.exceptions.ClientError as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            400,
        )
    except Exception as err:
        logger.error(err)
        return get_err_json_response(
            str(err),
            err.args,
            501,
        )


def read_a_file(s3_path: str):
    """Reads a file from S3.

    Args:
        s3_path (str): file path

    Returns:
        Success message.
        Otherwise returns BadRequest/InternalServerError response in case of failure
    """
    client = boto3.client("s3")
    try:
        logger.info("Inside s3 read file!")
        logger.info("s3_path",s3_path)
        bucket_name: str = os.getenv("S3_BUCKET_NAME", "null")
        file_name = "/".join(s3_path.split("/")[3:])
        logger.info("bucket name inside read file from s3 function", bucket_name)
        logger.info("filename inside read file from s3 function", file_name)
        response = client.get_object(Bucket=bucket_name, Key=file_name)
        html_content = response["Body"].read().decode("utf-8")
        return html_content
    except client.exceptions.NoSuchBucket as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            404,
        )  # 400 bad request response
    except client.exceptions.ClientError as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            400,
        )
    except Exception as err:
        logger.error(err)
        return get_err_json_response(
            str(err),
            err.args,
            501,
        )


def copy_file_s3(s3_path: str, doc_name: str):
    client = boto3.client("s3")
    try:
        logger.info("Inside s3 copy!")
        s3_sub_path = s3_path.split("templates")[-1]
        bucket_name: str = os.getenv("S3_BUCKET_NAME", "null")
        logger.info("s3_sub_path",s3_sub_path)
        file_name = s3_sub_path.split('/')[-1]  
        split_str = s3_sub_path.rsplit("/", 1)
        logger.info("Contents of split_str",split_str)
        response = client.copy_object(
            CopySource={"Bucket": bucket_name, "Key": f"templates{s3_sub_path}"},
            Bucket=bucket_name,
            Key=f"documents{split_str[0]}/{doc_name}_{file_name}",
        )

        if response:
            s3_path = f"s3://{bucket_name}/documents{split_str[0]}/{doc_name}_{file_name}"
            return s3_path
        else:
            raise Exception

    except client.exceptions.NoSuchBucket as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            404,
        )  # 400 bad request response
    except client.exceptions.ClientError as err:
        logger.error(err)
        return get_err_json_response(
            err.response["Error"]["Message"],
            err.args,
            400,
        )
    except Exception as err:
        logger.error(err)
        return get_err_json_response(
            str(err),
            err.args,
            501,
        )