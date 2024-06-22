# Start with the official Python base image
FROM python:3.12-slim

# Set the working directory
WORKDIR /backend

# Install Poetry
RUN pip install poetry

# Configure Poetry to not create a virtual environment
RUN poetry config virtualenvs.create false

# Copy Poetry configuration files
COPY pyproject.toml poetry.lock ./

# Install dependencies without installing the current project
RUN poetry install --no-root --sync

# Copy the rest of the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 8080

# Start the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
