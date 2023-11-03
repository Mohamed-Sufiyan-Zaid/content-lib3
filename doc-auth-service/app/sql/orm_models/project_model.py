from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from app.sql.database.db_manager import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True, index=True)
    admin_config_id = Column(Integer, ForeignKey("adminconfig.id"))
    ntid = Column(String)
    project_name = Column(String, nullable=False)
    version = Column(Integer, default=1)
    last_modified_by = Column(DateTime, default=func.now())
    group_name = Column(String)
    template = relationship(
        "Template", back_populates="project", cascade="all, delete-orphan"
    )
    document = relationship(
        "Document", back_populates="project", cascade="all, delete-orphan"
    )
