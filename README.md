# C++ Project Generator

A powerful command-line tool for generating modern C++ libraries and applications with proper CMake structure, CPM dependency management, and Google Test integration.

## Features

- 🚀 **Interactive Mode**: Guided project creation with prompts
- 📦 **Library & Application Templates**: Generate both library and application projects
- 🔧 **Modern CMake**: Uses CMake 3.20+ with CPM.cmake for dependency management
- 🧪 **Google Test Integration**: Automatic test framework setup
- 📚 **Best Practices**: Follows modern C++17/20/23 best practices
- 🎯 **Dependency Management**: Easy integration of popular C++ libraries
- 📝 **Documentation**: Auto-generated README and documentation templates
- 🔒 **Git Integration**: Proper .gitignore and license files

## Installation

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/ozacod/cpp-project-generator.git
cd cpp-project-generator

# Run with Docker Compose
docker-compose up --build

# Access the web interface at http://localhost:3000
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/ozacod/cpp-project-generator.git
cd cpp-project-generator

# Install dependencies
npm install

# Start development server
npm run dev

# Access the web interface at http://localhost:3000
```

### Option 3: Command Line Tool (Legacy)

```bash
# Run the installation script
./install.sh

# Or use directly
python3 cpp_project_generator.py --help
```

## Docker Usage

### Quick Start

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the web interface at http://localhost:3000
```

### Development Mode

```bash
# Run in development mode with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

### Manual Docker Commands

```bash
# Build the image
docker build -t cpp-project-generator .

# Run the container
docker run -p 3000:3000 cpp-project-generator

# Run with data persistence
docker run -p 3000:3000 -v $(pwd)/data:/app/data cpp-project-generator
```

For detailed Docker documentation, see [README-DOCKER.md](README-DOCKER.md).

## Usage

### Web Interface (Recommended)

1. Start the application using Docker or local development
2. Open your browser and go to `http://localhost:3000`
3. Fill out the project form with your desired settings
4. Click "Generate Project" to create and download your C++ project

### Interactive Mode (Legacy CLI)

```bash
cpp-project-generator --interactive
```

This will guide you through:
- Project name and type selection
- Dependency selection
- CMake version and C++ standard
- Test and example inclusion

### Command Line Mode

```bash
# Create a library
cpp-project-generator --name mylib --type library --deps "spdlog,nlohmann/json,curl"

# Create an application
cpp-project-generator --name myapp --type application --deps "spdlog,yaml-cpp" --examples

# Skip tests
cpp-project-generator --name simplelib --type library --no-tests
```

## Generated Project Structure

```
project_name/
├── CMakeLists.txt          # Main CMake configuration
├── cmake/
│   └── CPM.cmake          # CPM dependency manager
├── include/
│   └── project_name/      # Public headers
├── src/
│   └── project_name/      # Source files
├── tests/                 # Unit tests (if enabled)
│   ├── CMakeLists.txt
│   └── test_project_name.cpp
├── examples/              # Example code (if enabled)
│   ├── CMakeLists.txt
│   └── main.cpp
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
└── LICENSE               # MIT license
```

## Supported Dependencies

The tool supports popular C++ libraries through CPM.cmake:

- **Logging**: spdlog
- **JSON**: nlohmann/json
- **HTTP**: curl
- **YAML**: yaml-cpp
- **Testing**: google/googletest
- **Networking**: asio (header-only)
- **Concurrency**: concurrentqueue (header-only)
- **WebSockets**: websocketpp (header-only)

## Generated Code Features

### Modern C++ Best Practices

- **RAII**: Resource management through constructors/destructors
- **Smart Pointers**: `std::unique_ptr` and `std::shared_ptr` usage
- **Move Semantics**: Proper move constructors and assignment operators
- **Exception Safety**: Comprehensive error handling
- **Structured Logging**: spdlog integration for all projects

### Library Template

```cpp
// Factory pattern with RAII
class Factory {
public:
    Factory();
    ~Factory();
    
    // Non-copyable, movable
    Factory(const Factory&) = delete;
    Factory& operator=(const Factory&) = delete;
    Factory(Factory&&) = default;
    Factory& operator=(Factory&&) = default;
    
    static std::unique_ptr<Factory> create();
    void initialize();
};
```

### Application Template

```cpp
// Application class with proper lifecycle management
class App {
public:
    App();
    ~App();
    
    static std::unique_ptr<App> create();
    void initialize();
    void run();
};
```

## Building Generated Projects

```bash
cd your_project
mkdir build && cd build
cmake ..
make

# Run tests
make test
# or
ctest

# Run examples (if enabled)
./examples/your_project_example
```

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `--name` | Project name (snake_case) | Required |
| `--type` | Project type (library/application) | Required |
| `--deps` | Comma-separated dependencies | None |
| `--cmake-version` | Minimum CMake version | 3.20 |
| `--cpp-standard` | C++ standard (17/20/23) | 23 |
| `--no-tests` | Skip test framework | false |
| `--examples` | Include example code | false |
| `--output-dir` | Output directory | current |

## Examples

### High-Frequency Trading Library

```bash
cpp-project-generator --name hft_engine \
  --type library \
  --deps "spdlog,nlohmann/json,curl,yaml-cpp" \
  --examples
```

### Web API Application

```bash
cpp-project-generator --name web_api \
  --type application \
  --deps "spdlog,nlohmann/json,curl" \
  --examples
```

### Simple Utility Library

```bash
cpp-project-generator --name utils \
  --type library \
  --deps "spdlog" \
  --no-tests
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with various project configurations
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Inspiration

This tool is inspired by the structure and best practices found in the hft-lib project, providing a standardized way to create new C++ projects with modern tooling and conventions.
