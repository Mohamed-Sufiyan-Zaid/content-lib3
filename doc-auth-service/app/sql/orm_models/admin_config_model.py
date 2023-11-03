from sqlalchemy import Column, String, Integer, ForeignKey
from app.sql.database.db_manager import Base


class AdminConfig(Base):
    __tablename__ = "adminconfig"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey("domain.id"))
    sub_domain_id = Column(Integer, ForeignKey("subdomain.id"))


class User(Base):
    __tablename__ = "user"
    __table_args__ = {"extend_existing": True}
    user_id = Column(Integer, primary_key=True)
    user_name = Column(String)
    user_type = Column(String)
