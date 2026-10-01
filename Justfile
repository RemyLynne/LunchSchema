#!/usr/bin/env just --justfile

@help:
    just --list

[private]
@install-frontend:
    cd WebContent && pnpm i --forzen-lockfile

# Only build the backend
@build-backend:
    ./gradlew -x bootJar
# Only build the frontend
@build-frontend: install-frontend
    cd WebContent && pnpm build
# Build frontend and backend
@build: build-frontend build-backend

# Run the backend
@run-backend:
    ./graldew -x bootRun
# Run the frontend
@run-frontend:
    cd WebContent && pnpm dev