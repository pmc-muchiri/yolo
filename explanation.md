YOLO E-Commerce — Explanation

## Overview

This document explains the YOLO E-Commerce application (PMC_YOLO), a MERN-stack sample app composed of three microservices: frontend, backend (Node/Express) and database (MongoDB). 

The project is containerized with Docker and orchestrated using Docker Compose.

## What this repo contains

- `client/` — This is React frontend (served at port 8080 by default in this project)

- `backend/` — Node/Express API (serves REST endpoints, usually port 5000)

- `database/` — Dockerfile and configuration for MongoDB

- `docker-compose.yaml` — Compose setup to build and bring up all services together at once

- `README.md` — project README (overview, instructions and how to build microservices from scratch)

> NB: You can verify filenames and exact port numbers in `docker-compose.yaml`, `backend/server.js`, and `client/package.json`.

## Architecture (high level)

- Client -> Backend  | Backend -> MongoDB 

This separation allows independent builds and scaling of each service.

## Prerequisites
As outlined in the README, the following are the requirements for running this project

- [Docker](https://www.docker.com/get-started)

- [Docker compose](https://docs.docker.com/compose/install/)

- [Git](https://git-scm.com/)

## Environment variables

Copy `.env.sample` to `.env` (or create `.env`) in the project root and populate required values. Typical vars used for the MongoDB service and backend include:

```bash
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=example
MONGO_INITDB_DATABASE=dbname
BACKEND_PORT=5000
CLIENT_PORT=8080
```

Adjust these values and key to match `docker-compose.yaml` and the services' Dockerfiles (backend)

## Quick start (local, Docker Compose)

1. Build and start all services (from the root directory):

```bash
docker-compose up --build
```

2. Run in detached mode:

```bash
docker-compose up -d --build
```

3. Stop and remove containers, networks and volumes:

```bash
docker-compose down -v
```

4. View logs:

```bash
docker-compose logs -f
```

5. to view last 50 logs

```bash
docker-compose logs -f --tail 50
```
## Useful image build test

Before you push to Dockerhub, build each images for test separately:

```bash
docker build -t yolo-client_test_image:v1.0.0 ./client
docker build -t yolo-backend_test_image:v1.0.0./backend
docker build -t yolo-db_test_image:v1.0.0 ./database
```

## Common troubleshooting

- Port conflicts: 
ensure ports used by services (e.g., 8080, 5000, 27017) are free.

- MongoDB authentication: 
confirm `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` in the `.env` match what's referenced in the backend `MONGODB_URI`.

- MongoDB Connection Fails Inside Docker:
When starting the backend container, you may see this error in the logs:

```bash
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

or 

```bash
MongoCompatibilityError: Server at pmc-yolo-database:27017 reports maximum wire version 3, but this version of the Node.js Driver requires at least 8 (MongoDB 4.2)
```

1. To fix this, Use the Docker service name as the hostname in your `.env` file and make sure both containers share the same network.

2. Version incompatibility between MongoDB and the Node.js drive: To fix this you can upgrage or downgrade mongoose.


- Persistent data: If data is unexpectedly missing, ensure volumes are configured correctly in `docker-compose.yaml`.


## Author & License

Author: [Paul Muchiri](https://github.com/pmc-muchiri)

The original project was forked from [yolo](https://github.com/Vinge1718/yolo).
