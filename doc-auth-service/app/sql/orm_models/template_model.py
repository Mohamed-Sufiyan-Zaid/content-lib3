from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum
from app.sql.database.db_manager import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum


class CreationType(enum.Enum):
    UPLOADED = "UPLOADED"
    CREATED = "CREATED"


class FileType(enum.Enum):
    PDF = "PDF"
    WORD = "WORD"
    HTML = "HTML"


class Template(Base):
    __tablename__ = "template"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True, index=True)
    template_name = Column(String, nullable=False)
    s3_bucket_path = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    template_creation_type = Column(Enum(CreationType), default=CreationType.CREATED)
    template_file_type = Column(Enum(FileType), default=FileType.HTML)
    created_date = Column(DateTime, default=func.now())
    updated_date = Column(DateTime, default=func.now())
    project = relationship("Project")
    document = relationship(
        "Document", back_populates="template", cascade="all, delete-orphan"
    )
    placeholders = relationship(
        "TemplatePlaceholder", backref="template", cascade="all, delete-orphan"
    )


class TemplatePlaceholder(Base):
    __tablename__ = "templateplaceholder"
    __table_args__ = {"extend_existing": True}
    id = Column(String, primary_key=True)
    template_id = Column(Integer, ForeignKey("template.id"))
