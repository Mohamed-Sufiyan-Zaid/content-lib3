import uvicorn
from app.sql.apis.api import app
from app.sql.database.db_defaults import main

main()

if __name__ == "__main__":
    # app()
    uvicorn.run("main:app", host="localhost", port=7001, reload=True)
