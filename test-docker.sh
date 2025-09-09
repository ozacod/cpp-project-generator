#!/bin/bash

echo "🐳 Testing Docker build for C++ Project Generator..."

# Build the Docker image
echo "Building Docker image..."
docker build -t cpp-project-generator-test .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # Test running the container
    echo "Testing container startup..."
    docker run --name cpp-project-generator-test-container -d -p 3001:3000 cpp-project-generator-test
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        
        # Wait a moment for the app to start
        echo "Waiting for application to start..."
        sleep 10
        
        # Test if the app is responding
        echo "Testing application health..."
        response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/projects)
        
        if [ "$response" = "200" ]; then
            echo "✅ Application is responding correctly!"
        else
            echo "❌ Application health check failed (HTTP $response)"
        fi
        
        # Clean up
        echo "Cleaning up test container..."
        docker stop cpp-project-generator-test-container
        docker rm cpp-project-generator-test-container
    else
        echo "❌ Failed to start container"
    fi
else
    echo "❌ Docker build failed"
    exit 1
fi

echo "🎉 Docker test completed!"
