FROM python:3.12-slim

WORKDIR /backend

RUN pip install poetry
RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --sync

COPY . .

EXPOSE 8000

CMD ["fastapi", "run"]
