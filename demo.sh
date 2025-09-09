#!/bin/bash

# C++ Project Generator Demo Script

echo "🚀 C++ Project Generator Demo"
echo "=============================="
echo ""

# Demo 1: Interactive mode (simulated)
echo "Demo 1: Interactive Mode"
echo "------------------------"
echo "This would run: cpp-project-generator --interactive"
echo ""

# Demo 2: Library creation
echo "Demo 2: Creating a Library"
echo "--------------------------"
echo "Creating 'crypto_utils' library with spdlog and nlohmann/json..."

python3 cpp_project_generator.py \
  --name crypto_utils \
  --type library \
  --deps "spdlog,nlohmann/json" \
  --examples

echo ""
echo "✅ Library created! Let's check the structure:"
echo ""
ls -la crypto_utils/
echo ""
echo "📁 Include directory:"
ls -la crypto_utils/include/crypto_utils/
echo ""
echo "📁 Source directory:"
ls -la crypto_utils/src/crypto_utils/
echo ""

# Demo 3: Application creation
echo "Demo 3: Creating an Application"
echo "-------------------------------"
echo "Creating 'trading_app' application with full dependencies..."

python3 cpp_project_generator.py \
  --name trading_app \
  --type application \
  --deps "spdlog,nlohmann/json,curl,yaml-cpp" \
  --examples

echo ""
echo "✅ Application created! Let's check the structure:"
echo ""
ls -la trading_app/
echo ""

# Demo 4: Simple library without tests
echo "Demo 4: Simple Library (No Tests)"
echo "----------------------------------"
echo "Creating 'simple_math' library without tests..."

python3 cpp_project_generator.py \
  --name simple_math \
  --type library \
  --deps "spdlog" \
  --no-tests

echo ""
echo "✅ Simple library created!"
echo ""

# Show how to build
echo "🔧 Building the Projects"
echo "========================"
echo ""
echo "To build any of these projects:"
echo "  cd <project_name>"
echo "  mkdir build && cd build"
echo "  cmake .."
echo "  make"
echo ""
echo "To run tests:"
echo "  make test"
echo ""
echo "To run examples:"
echo "  ./examples/<project_name>_example"
echo ""

# Cleanup
echo "🧹 Cleaning up demo projects..."
rm -rf crypto_utils trading_app simple_math
echo "✅ Demo complete!"
