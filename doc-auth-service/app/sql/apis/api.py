from fastapi import FastAPI
from app.commons.load_config import config
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from app.sql.apis.routers.admin_config_router import admin_config_router
from app.sql.apis.routers.domain_router import domain_router
from app.sql.apis.routers.project_router import project_router
from app.sql.apis.routers.template_router import template_router
from app.sql.apis.routers.document_router import document_router
from app.sql.apis.routers.dashboard_router import dashboard_router
from app.sql.apis.routers.chat_history_router import chat_history_router
from app.sql.schemas.requests.HealthCheckRequest import HealthCheckResponse, Status

app = FastAPI(
    title="Doc Authoring Service",
    version="0.1",
    openapi_url=(config["api_prefix"] + "/openapi.json"),
    docs_url=(config["api_prefix"] + "/docs"),
    redoc_url=(config["api_prefix"] + "/redoc"),
)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_config_router, tags=["admin-config"])
app.include_router(domain_router, tags=["domain"])
app.include_router(project_router, tags=["project"])
app.include_router(template_router, tags=["template"])
app.include_router(document_router, tags=["document"])
app.include_router(dashboard_router, tags=["dashboard"])
app.include_router(chat_history_router, tags=["chat history"])


@app.get(
    f"{config['api_prefix']}/health_check",
    status_code=200,
    tags=["Health check"],
)
async def health_check():
    return HealthCheckResponse(
        status=Status.success, message="health_check completed successfully"
    )


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Doc Authoring Service",
        version="0.1",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
