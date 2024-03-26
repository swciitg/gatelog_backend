# Node.js Server with Docker Compose

This is the backend server for Khokha Entry on [OneStop IITG](https://github.com/swciitg/onestop_flutter) setup with Docker Compose for building and running in a containerized environment.

## Requirements

- Node.js
- Docker
- Docker Compose

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/swciitg/khokha_entry_backend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd khokha_entry_backend
    ```

3. Build the Docker image and start the server:

    ```bash
    docker compose -f docker-compose.dev.yml up --build
    ```

## Usage

Once the Docker container is up and running, you can access your Node.js server at `http://localhost:7500`.

## Configuration

You can configure your Node.js server by modifying the `.env.dev`, `Dockerfile.dev` and `docker-compose.dev.yml` files according to your requirements.

## Project Structure
- `Dockerfile.*`: Contains instructions to build the Docker image for your Node.js server.
- `docker-compose.*.yml`: Defines the Docker services and configurations for building and running the container.
- `app.js`: Entry point file for the Node.js server.
- `package.json`: Node.js project configuration file.
