from sqlalchemy import Column, String, Integer, ForeignKey
from app.sql.database.db_manager import Base


class Domain(Base):
    __tablename__ = "domain"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    name = Column(String)


class SubDomain(Base):
    __tablename__ = "subdomain"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    name = Column(String)
    domain_id = Column(Integer, ForeignKey("domain.id"))
