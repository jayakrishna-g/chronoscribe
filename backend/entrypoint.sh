#!/bin/sh

# Replace environment variables in config.template.toml and create config.toml
envsubst < ./config.toml > ./config.tmp

# Rename the temporary file back to the original filename
mv ./config.tmp ./config.toml

# Execute the command passed to the container
exec "$@"
