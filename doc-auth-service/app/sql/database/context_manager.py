from . import db_manager
from contextlib import contextmanager

@contextmanager
def session():
    try:
        current_session = db_manager.SessionLocal()
        yield current_session
    finally:
        current_session.close()

