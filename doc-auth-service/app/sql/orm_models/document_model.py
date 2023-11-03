from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON
from app.sql.database.db_manager import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Document(Base):
    __tablename__ = "document"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True, index=True)
    doc_name = Column(String, nullable=False)
    admin_config_id = Column(Integer, ForeignKey("adminconfig.id"))
    s3_bucket_path = Column(String)
    template_id = Column(Integer, ForeignKey("template.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    created_date = Column(DateTime, default=func.now())
    content_library = Column(String)
    content_library_metadata = Column(String)
    doc_author = Column(String)
    project = relationship("Project")
    template = relationship("Template")


class DocumentPlaceholder(Base):
    __tablename__ = "documentplaceholder"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(Integer, ForeignKey("document.id"))
    template_placeholder_id = Column(String, ForeignKey("templateplaceholder.id"))
    chat_history_id = Column(Integer)


class ChatHistory(Base):
    __tablename__ = "chathistory"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    chat_history = Column(JSON)


