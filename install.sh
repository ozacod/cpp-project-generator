#!/bin/bash

# C++ Project Generator Installation Script

echo "🚀 Installing C++ Project Generator..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required but not installed."
    exit 1
fi

# Make the script executable
chmod +x cpp_project_generator.py

# Create a symlink in /usr/local/bin if possible
if [ -w /usr/local/bin ]; then
    ln -sf "$(pwd)/cpp_project_generator.py" /usr/local/bin/cpp-project-generator
    echo "✅ Installed to /usr/local/bin/cpp-project-generator"
else
    echo "📁 To use globally, add this directory to your PATH:"
    echo "   export PATH=\"$(pwd):\$PATH\""
    echo "   echo 'export PATH=\"$(pwd):\$PATH\"' >> ~/.bashrc"
fi

echo "✅ Installation complete!"
echo ""
echo "Usage:"
echo "  cpp-project-generator --interactive"
echo "  cpp-project-generator --help"
