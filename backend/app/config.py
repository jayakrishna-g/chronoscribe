import os
from typing import Any

import tomli
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    app_name: str
    api_version: str
    database_url: str
    jwt_secret_key: str
    enable_logging: bool
    debug: bool = False
    optimize: bool = False
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


def load_toml_config(path: str) -> dict[str, Any]:
    with open(path, "rb") as toml_file:
        return tomli.load(toml_file)


def get_config():
    # Load the TOML configuration
    toml_config = load_toml_config("config.toml")

    # Fetch the environment profile
    profile = os.getenv("APP_PROFILE", "development")

    # Merge default settings with environment specific settings
    config_data = {**toml_config["default"], **toml_config.get(profile, {})}

    # Create a Pydantic Settings model instance
    settings = Settings(**config_data)

    return settings


# Usage
config = get_config()
