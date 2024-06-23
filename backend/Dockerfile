FROM python:3.12-slim

WORKDIR /backend

RUN pip install poetry
RUN poetry config virtualenvs.create false

RUN apt-get update && apt-get install -y gettext



COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --sync

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8000

CMD ["fastapi", "run"]
