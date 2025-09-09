# Docker Setup for C++ Project Generator

This document provides instructions for running the C++ Project Generator web interface using Docker.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later)

## Quick Start

### Production Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and go to `http://localhost:3000`

3. **Test the Docker build:**
   ```bash
   ./test-docker.sh
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Development Mode

1. **Run in development mode:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Open your browser and go to `http://localhost:3000`
   - Hot reload is enabled for development

## Manual Docker Commands

### Production Build

1. **Build the Docker image:**
   ```bash
   docker build -t cpp-project-generator .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 --name cpp-project-generator cpp-project-generator
   ```

3. **Stop and remove the container:**
   ```bash
   docker stop cpp-project-generator
   docker rm cpp-project-generator
   ```

### Development Build

1. **Build the development image:**
   ```bash
   docker build -f Dockerfile.dev -t cpp-project-generator-dev .
   ```

2. **Run the development container:**
   ```bash
   docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules cpp-project-generator-dev
   ```

## Configuration

### Environment Variables

The following environment variables can be configured:

- `NODE_ENV`: Set to `production` or `development`
- `NEXT_TELEMETRY_DISABLED`: Set to `1` to disable Next.js telemetry
- `PORT`: Port number (default: 3000)
- `HOSTNAME`: Hostname to bind to (default: "0.0.0.0")

### Data Persistence

The SQLite database is stored in the container. To persist data between container restarts:

1. **Using Docker Compose (recommended):**
   ```yaml
   volumes:
     - ./data:/app/data
   ```

2. **Using Docker run:**
   ```bash
   docker run -p 3000:3000 -v $(pwd)/data:/app/data cpp-project-generator
   ```

## Health Checks

The production Docker setup includes health checks that verify the application is running correctly:

- **Endpoint:** `http://localhost:3000/api/projects`
- **Interval:** 30 seconds
- **Timeout:** 10 seconds
- **Retries:** 3
- **Start Period:** 40 seconds

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Change the port mapping
   docker run -p 3001:3000 cpp-project-generator
   ```

2. **Permission issues with volumes:**
   ```bash
   # Fix ownership
   sudo chown -R $USER:$USER ./data
   ```

3. **Container won't start:**
   ```bash
   # Check logs
   docker logs cpp-project-generator
   ```

### Debugging

1. **Access container shell:**
   ```bash
   docker exec -it cpp-project-generator sh
   ```

2. **View container logs:**
   ```bash
   docker logs -f cpp-project-generator
   ```

3. **Inspect container:**
   ```bash
   docker inspect cpp-project-generator
   ```

## Multi-Architecture Support

The Dockerfile supports multiple architectures:

- `linux/amd64` (Intel/AMD 64-bit)
- `linux/arm64` (ARM 64-bit, Apple Silicon)

To build for a specific architecture:

```bash
docker build --platform linux/amd64 -t cpp-project-generator .
```

## Security Considerations

- The application runs as a non-root user (`nextjs`)
- Only necessary ports are exposed (3000)
- Health checks ensure the application is functioning
- Environment variables are properly configured

## Performance Optimization

- Multi-stage build reduces image size
- Standalone Next.js output minimizes dependencies
- Alpine Linux base image for smaller footprint
- Proper layer caching for faster rebuilds
