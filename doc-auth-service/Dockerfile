# FROM  420737321821.dkr.ecr.us-east-1.amazonaws.com/core-vsl-python3.9-slim
FROM python:3.9

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    LOG_LEVEL=warning

COPY requirements.txt .

RUN python -m pip install -r requirements.txt

WORKDIR /app

# Copy the application code into the container
COPY . /app

EXPOSE 8000

# CMD ["uvicorn", "app.main:app","--host","0.0.0.0:8000", "--workers", "3"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]


#command to run Dockerfile 
#1)docker build -t my_fastapi_app . 
#2)docker run -p 8000:80 my_fastapi_app
