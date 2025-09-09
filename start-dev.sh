#!/bin/bash

# C++ Project Generator Web Interface Startup Script

echo "🚀 Starting C++ Project Generator Web Interface"
echo "=============================================="

# Check if Python script exists and is executable
if [ ! -f "cpp_project_generator.py" ]; then
    echo "❌ Error: cpp_project_generator.py not found"
    exit 1
fi

if [ ! -x "cpp_project_generator.py" ]; then
    echo "🔧 Making Python script executable..."
    chmod +x cpp_project_generator.py
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required but not installed"
    exit 1
fi

# Check if CMake is available
if ! command -v cmake &> /dev/null; then
    echo "⚠️  Warning: CMake not found. Project building may not work"
fi

echo "✅ Prerequisites checked"
echo "🌐 Starting development server..."
echo ""
echo "The web interface will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
