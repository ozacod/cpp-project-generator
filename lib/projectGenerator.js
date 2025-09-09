const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const execAsync = promisify(exec);

class ProjectGenerator {
  constructor() {
    this.tempDir = null;
  }

  async generateProject(projectData) {
    try {
      // Create temporary directory
      this.tempDir = await fs.mkdtemp('/tmp/cpp-project-');
      
      // Generate project structure
      await this.createProjectStructure(projectData);
      
      // Create zip file
      const zipPath = await this.createZipFile(projectData.name);
      
      // Read zip file as buffer
      const zipBuffer = await fs.readFile(zipPath);
      
      // Cleanup
      await this.cleanup();
      
      return zipBuffer;
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  async createProjectStructure(projectData) {
    const projectDir = path.join(this.tempDir, projectData.name);
    await fs.mkdir(projectDir, { recursive: true });

    // Create directory structure
    await fs.mkdir(path.join(projectDir, 'include', projectData.name), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'src', projectData.name), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'cmake'), { recursive: true });
    
    if (projectData.includeTests) {
      await fs.mkdir(path.join(projectDir, 'tests'), { recursive: true });
    }
    
    if (projectData.includeExamples) {
      await fs.mkdir(path.join(projectDir, 'examples'), { recursive: true });
    }

    // Create files
    await this.createCMakeFiles(projectDir, projectData);
    await this.createSourceFiles(projectDir, projectData);
    await this.createHeaderFiles(projectDir, projectData);
    await this.createConfigFiles(projectDir, projectData);
    
    if (projectData.includeTests) {
      await this.createTestFiles(projectDir, projectData);
    }
    
    if (projectData.includeExamples) {
      await this.createExampleFiles(projectDir, projectData);
    }
  }

  async createCMakeFiles(projectDir, projectData) {
    // Main CMakeLists.txt
    const cmakeContent = this.getCMakeTemplate(projectData);
    await fs.writeFile(path.join(projectDir, 'CMakeLists.txt'), cmakeContent);

    // CPM.cmake
    const cpmContent = this.getCPMContent();
    await fs.writeFile(path.join(projectDir, 'cmake', 'CPM.cmake'), cpmContent);

    // CPMConfig.cmake
    const cpmConfigContent = this.getCPMConfigContent();
    await fs.writeFile(path.join(projectDir, 'cmake', 'CPMConfig.cmake'), cpmConfigContent);

    // Tests CMakeLists.txt
    if (projectData.includeTests) {
      const testsCMakeContent = this.getTestsCMakeTemplate(projectData);
      await fs.writeFile(path.join(projectDir, 'tests', 'CMakeLists.txt'), testsCMakeContent);
    }
  }

  async createSourceFiles(projectDir, projectData) {
    const exampleContent = this.getExampleSourceContent(projectData);
    await fs.writeFile(path.join(projectDir, 'src', projectData.name, 'example.cpp'), exampleContent);

    const factoryContent = this.getFactorySourceContent(projectData);
    await fs.writeFile(path.join(projectDir, 'src', projectData.name, 'factory.cpp'), factoryContent);
  }

  async createHeaderFiles(projectDir, projectData) {
    const exampleHeaderContent = this.getExampleHeaderContent(projectData);
    await fs.writeFile(path.join(projectDir, 'include', projectData.name, 'example.h'), exampleHeaderContent);

    const factoryHeaderContent = this.getFactoryHeaderContent(projectData);
    await fs.writeFile(path.join(projectDir, 'include', projectData.name, 'factory.h'), factoryHeaderContent);
  }

  async createConfigFiles(projectDir, projectData) {
    // .gitignore
    const gitignoreContent = this.getGitignoreContent();
    await fs.writeFile(path.join(projectDir, '.gitignore'), gitignoreContent);

    // README.md
    const readmeContent = this.getReadmeContent(projectData);
    await fs.writeFile(path.join(projectDir, 'README.md'), readmeContent);

    // LICENSE
    const licenseContent = this.getLicenseContent(projectData);
    await fs.writeFile(path.join(projectDir, 'LICENSE'), licenseContent);
  }

  async createTestFiles(projectDir, projectData) {
    const testContent = this.getTestContent(projectData);
    await fs.writeFile(path.join(projectDir, 'tests', `${projectData.name}_test.cpp`), testContent);
  }

  async createExampleFiles(projectDir, projectData) {
    const exampleContent = this.getExampleAppContent(projectData);
    await fs.writeFile(path.join(projectDir, 'examples', 'main.cpp'), exampleContent);
  }

  async createZipFile(projectName) {
    const zipPath = path.join(this.tempDir, `${projectName}.zip`);
    
    try {
      // Use zip command to create zip file
      const { stdout, stderr } = await execAsync(`cd "${this.tempDir}" && zip -r "${projectName}.zip" "${projectName}"`);
      
      if (stderr && !stderr.includes('adding:') && !stderr.includes('updating:')) {
        console.warn('Zip warning:', stderr);
      }
      
      return zipPath;
    } catch (error) {
      console.error('Zip command failed:', error);
      throw new Error(`Failed to create zip: ${error.message}`);
    }
  }

  async cleanup() {
    if (this.tempDir) {
      try {
        await fs.rm(this.tempDir, { recursive: true, force: true });
      } catch (error) {
        console.error('Error cleaning up temp directory:', error);
      }
      this.tempDir = null;
    }
  }

  // Template methods
  getCMakeTemplate(projectData) {
    const depsSection = this.getDependenciesCMake(projectData.dependencies);
    const testSection = projectData.includeTests ? `
# Tests
if(BUILD_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()` : '';
    
    const exampleSection = projectData.includeExamples ? `
# Examples
add_executable(${projectData.name}_example examples/main.cpp)
target_link_libraries(${projectData.name}_example ${projectData.name})` : '';

    return `cmake_minimum_required(VERSION ${projectData.cmakeVersion})

project(${projectData.name} VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD ${projectData.cppStandard})
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Include CPM configuration for local dependency management
include(cmake/CPMConfig.cmake)

${depsSection}

# Find required packages
find_package(Threads REQUIRED)

# Create ${projectData.type}
${projectData.type === 'library' ? 
  `add_library(${projectData.name} STATIC
    src/${projectData.name}/example.cpp
    src/${projectData.name}/factory.cpp
)

target_include_directories(${projectData.name} PUBLIC
    $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)

target_link_libraries(${projectData.name} PUBLIC Threads::Threads)` :
  `add_executable(${projectData.name}
    src/${projectData.name}/example.cpp
    src/${projectData.name}/factory.cpp
)

target_include_directories(${projectData.name} PRIVATE include)
target_link_libraries(${projectData.name} PRIVATE Threads::Threads)`
}

${testSection}
${exampleSection}

# Install targets
install(TARGETS ${projectData.name}
    EXPORT ${projectData.name}Targets
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
    RUNTIME DESTINATION bin
    INCLUDES DESTINATION include
)

install(DIRECTORY include/ DESTINATION include)
install(FILES LICENSE DESTINATION .)
install(FILES README.md DESTINATION .)`;
  }

  getDependenciesCMake(dependencies) {
    if (!dependencies || dependencies.length === 0) {
      return '';
    }

    const deps = dependencies.map(dep => {
      dep = dep.trim();
      if (!dep) return '';

      // Handle different dependency formats
      if (dep.includes('@')) {
        const [name, version] = dep.split('@', 2);
        if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('git@')) {
          const repoName = name.split('/').pop().replace('.git', '');
          return `CPMAddPackage("NAME ${repoName}" GIT_REPOSITORY "${name}" GIT_TAG "${version}")`;
        } else if (name.includes('/')) {
          return `CPMAddPackage("gh:${name}@${version}")`;
        } else {
          const depMappings = {
            "spdlog": "gabime/spdlog",
            "nlohmann/json": "nlohmann/json",
            "curl": "curl/curl",
            "yaml-cpp": "jbeder/yaml-cpp",
            "googletest": "google/googletest",
            "asio": "chriskohlhoff/asio",
            "websocketpp": "zaphoyd/websocketpp",
            "concurrentqueue": "cameron314/concurrentqueue"
          };
          const fullName = depMappings[name] || name;
          return `CPMAddPackage("gh:${fullName}@${version}")`;
        }
      } else {
        if (dep.startsWith('http://') || dep.startsWith('https://') || dep.startsWith('git@')) {
          const repoName = dep.split('/').pop().replace('.git', '');
          return `CPMAddPackage("NAME ${repoName}" GIT_REPOSITORY "${dep}")`;
        } else if (dep.includes('/')) {
          return `CPMAddPackage("gh:${dep}")`;
        } else {
          const depMappings = {
            "spdlog": "gabime/spdlog",
            "nlohmann/json": "nlohmann/json",
            "curl": "curl/curl",
            "yaml-cpp": "jbeder/yaml-cpp",
            "googletest": "google/googletest",
            "asio": "chriskohlhoff/asio",
            "websocketpp": "zaphoyd/websocketpp",
            "concurrentqueue": "cameron314/concurrentqueue"
          };
          const fullName = depMappings[dep] || dep;
          return `CPMAddPackage("gh:${fullName}")`;
        }
      }
    }).filter(dep => dep).join('\n');

    return deps ? `# Dependencies\n${deps}\n` : '';
  }

  getCPMContent() {
    return `# SPDX-License-Identifier: MIT
#
# SPDX-FileCopyrightText: Copyright (c) 2019-2023 Lars Melchior and contributors

set(CPM_DOWNLOAD_VERSION 0.42.0)
set(CPM_HASH_SUM "2020b4fc42dba44817983e06342e682ecfc3d2f484a581f11cc5731fbe4dce8a")

if(CPM_SOURCE_CACHE)
  set(CPM_DOWNLOAD_LOCATION "\${CPM_SOURCE_CACHE}/cpm/CPM_\${CPM_DOWNLOAD_VERSION}.cmake")
elseif(DEFINED ENV{CPM_SOURCE_CACHE})
  set(CPM_DOWNLOAD_LOCATION "\$ENV{CPM_SOURCE_CACHE}/cpm/CPM_\${CPM_DOWNLOAD_VERSION}.cmake")
else()
  set(CPM_DOWNLOAD_LOCATION "\${CMAKE_BINARY_DIR}/cmake/CPM_\${CPM_DOWNLOAD_VERSION}.cmake")
endif()

# Expand relative path. This is important if the provided path contains a tilde (~)
get_filename_component(CPM_DOWNLOAD_LOCATION \${CPM_DOWNLOAD_LOCATION} ABSOLUTE)

file(DOWNLOAD
     https://github.com/cpm-cmake/CPM.cmake/releases/download/v\${CPM_DOWNLOAD_VERSION}/CPM.cmake
     \${CPM_DOWNLOAD_LOCATION} EXPECTED_HASH SHA256=\${CPM_HASH_SUM}
)

include(\${CPM_DOWNLOAD_LOCATION})
`;
  }

  getCPMConfigContent() {
    return `# CPMConfig.cmake - Local dependency management configuration
# This file configures CPM to use local directories for dependencies

# Set CPM cache directory to local project directory
# This keeps all dependencies in the same project folder for easier management
set(CPM_CACHE_DIR "\${CMAKE_CURRENT_SOURCE_DIR}/dependencies" CACHE PATH "CPM cache directory")

# Set CPM download directory
set(CPM_DOWNLOAD_DIR "\${CPM_CACHE_DIR}/downloads" CACHE PATH "CPM download directory")

# Set CPM source directory
set(CPM_SOURCE_DIR "\${CPM_CACHE_DIR}/sources" CACHE PATH "CPM source directory")

# Set CPM binary directory
set(CPM_BINARY_DIR "\${CPM_CACHE_DIR}/binaries" CACHE PATH "CPM binary directory")

# Create cache directories if they don't exist
file(MAKE_DIRECTORY "\${CPM_CACHE_DIR}")
file(MAKE_DIRECTORY "\${CPM_DOWNLOAD_DIR}")
file(MAKE_DIRECTORY "\${CPM_SOURCE_DIR}")
file(MAKE_DIRECTORY "\${CPM_BINARY_DIR}")

# Set CPM options for better dependency management
set(CPM_USE_LOCAL_PACKAGES OFF CACHE BOOL "Force download to local cache")
set(CPM_USE_NAMED_CACHE_DIRS ON CACHE BOOL "Use named cache directories")

# Force CPM to use our local cache directories
set(CPM_SOURCE_CACHE "\${CPM_SOURCE_DIR}" CACHE PATH "CPM source cache")
set(CPM_DOWNLOAD_CACHE "\${CPM_DOWNLOAD_DIR}" CACHE PATH "CPM download cache")

# Print cache information
message(STATUS "CPM Cache Directory: \${CPM_CACHE_DIR}")
message(STATUS "CPM Download Directory: \${CPM_DOWNLOAD_DIR}")
message(STATUS "CPM Source Directory: \${CPM_SOURCE_DIR}")
message(STATUS "CPM Binary Directory: \${CPM_BINARY_DIR}")

# Include CPM.cmake
include(\${CMAKE_CURRENT_LIST_DIR}/CPM.cmake)
`;
  }

  getTestsCMakeTemplate(projectData) {
    return `# Test configuration for ${projectData.name}
cmake_minimum_required(VERSION ${projectData.cmakeVersion})

# Google Test for unit testing
CPMAddPackage("gh:google/googletest@1.14.0")

# Find required packages
find_package(Threads REQUIRED)

# Create test executable
add_executable(${projectData.name}_test ${projectData.name}_test.cpp)

# Link libraries
target_link_libraries(${projectData.name}_test 
    ${projectData.name}
    gtest
    gtest_main
    Threads::Threads
)

# Include directories
target_include_directories(${projectData.name}_test PRIVATE 
    \${CMAKE_SOURCE_DIR}/include
)

# Add test to CTest
add_test(NAME ${projectData.name}_test COMMAND ${projectData.name}_test)
`;
  }

  getExampleSourceContent(projectData) {
    return `#include "${projectData.name}/example.h"
#include <iostream>

namespace ${projectData.name} {

Example::Example() {
    std::cout << "Example created for ${projectData.name}" << std::endl;
}

void Example::doSomething() {
    std::cout << "Doing something in ${projectData.name}::Example" << std::endl;
}

} // namespace ${projectData.name}
`;
  }

  getFactorySourceContent(projectData) {
    return `#include "${projectData.name}/factory.h"
#include <memory>
#include <iostream>

namespace ${projectData.name} {

std::unique_ptr<Example> Factory::create() {
    return std::make_unique<Example>();
}

void Factory::initialize() {
    std::cout << "Factory initialized for ${projectData.name}" << std::endl;
}

} // namespace ${projectData.name}
`;
  }

  getExampleHeaderContent(projectData) {
    return `#pragma once

namespace ${projectData.name} {

class Example {
public:
    Example();
    void doSomething();
};

} // namespace ${projectData.name}
`;
  }

  getFactoryHeaderContent(projectData) {
    return `#pragma once
#include "${projectData.name}/example.h"
#include <memory>

namespace ${projectData.name} {

class Factory {
public:
    static std::unique_ptr<Example> create();
    static void initialize();
};

} // namespace ${projectData.name}
`;
  }

  getGitignoreContent() {
    return `# Build directories
build/
dependencies/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Compiled files
*.o
*.a
*.so
*.dylib
*.exe

# CMake
CMakeCache.txt
CMakeFiles/
cmake_install.cmake
Makefile
*.cmake
!CMakeLists.txt
!cmake/*.cmake

# Test results
Testing/
test_results.xml
`;
  }

  getReadmeContent(projectData) {
    const depsList = projectData.dependencies && projectData.dependencies.length > 0 
      ? projectData.dependencies.map(dep => `- ${dep}`).join('\n')
      : '- No external dependencies';

    return `# ${projectData.name}

A modern C++ ${projectData.type} built with CMake and CPM dependency management.

## Features

- **Modern C++**: Uses C++${projectData.cppStandard} standard
- **CMake ${projectData.cmakeVersion}+**: Modern CMake build system
- **CPM Integration**: Local dependency management with Git LFS support
- **Google Test**: ${projectData.includeTests ? 'Unit testing framework included' : 'No testing framework'}
- **Examples**: ${projectData.includeExamples ? 'Example applications included' : 'No examples'}

## Dependencies

${depsList}

## Building

\`\`\`bash
# Initialize git repository
git init

# Create build directory and build
mkdir build && cd build
cmake ..
make
\`\`\`

## Running Tests

\`\`\`bash
cd build
make test
# or
ctest
\`\`\`

## Dependency Management with Git LFS

This project uses CPM (CPM.cmake) for dependency management with local caching. Dependencies are stored in the \`dependencies/\` directory within the project for easy management and Git LFS tracking.

### Setting up Git LFS for Dependencies

1. **Install Git LFS** (if not already installed):
   \`\`\`bash
   # macOS
   brew install git-lfs
   
   # Ubuntu/Debian
   sudo apt install git-lfs
   
   # Windows
   # Download from https://git-lfs.github.io/
   \`\`\`

2. **Initialize Git LFS in your repository**:
   \`\`\`bash
   git lfs install
   \`\`\`

3. **Track the dependencies directory and ignore build directory**:
   \`\`\`bash
   # From the project root
   git lfs track "dependencies/**"
   echo "build/" >> .gitignore
   git add .gitattributes .gitignore
   git commit -m "Add Git LFS tracking for dependencies and ignore build directory"
   \`\`\`

4. **Add and commit the dependencies directory**:
   \`\`\`bash
   # After building the project (dependencies will be downloaded)
   git add dependencies/
   git commit -m "Add dependencies with Git LFS"
   git push
   \`\`\`

### Benefits of Local Dependency Management

- **Self-contained**: All dependencies are in the project directory
- **Easy sharing**: Just zip the project folder to share everything
- **Version control**: Dependencies are tracked with Git LFS
- **Portable**: No external cache dependencies

### Dependencies Directory Structure

\`\`\`
dependencies/
├── downloads/     # Downloaded source archives
├── sources/       # Extracted source code
└── binaries/      # Built binaries and libraries
\`\`\`


## Usage

### Library

\`\`\`cpp
#include "${projectData.name}/factory.h"

auto factory = ${projectData.name}::Factory::create();
factory->initialize();
\`\`\`

### Application

\`\`\`cpp
#include "${projectData.name}/factory.h"

int main() {
    ${projectData.name}::Factory::initialize();
    auto example = ${projectData.name}::Factory::create();
    example->doSomething();
    return 0;
}
\`\`\`

## License

MIT License - see LICENSE file for details.
`;
  }

  getLicenseContent(projectData) {
    return `MIT License

Copyright (c) ${new Date().getFullYear()} ${projectData.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
  }

  getTestContent(projectData) {
    return `#include <gtest/gtest.h>
#include "${projectData.name}/factory.h"

using namespace ${projectData.name};

class ${projectData.name}Test : public ::testing::Test {
protected:
    void SetUp() override {
        // Setup code here
    }
    
    void TearDown() override {
        // Cleanup code here
    }
};

TEST_F(${projectData.name}Test, FactoryCreatesExample) {
    auto example = Factory::create();
    ASSERT_NE(example, nullptr);
}

TEST_F(${projectData.name}Test, ExampleDoesSomething) {
    auto example = Factory::create();
    EXPECT_NO_THROW(example->doSomething());
}

TEST_F(${projectData.name}Test, FactoryInitializes) {
    EXPECT_NO_THROW(Factory::initialize());
}
`;
  }

  getExampleAppContent(projectData) {
    return `#include "${projectData.name}/factory.h"
#include <iostream>

int main() {
    std::cout << "Welcome to ${projectData.name} example!" << std::endl;
    
    // Initialize the factory
    ${projectData.name}::Factory::initialize();
    
    // Create an example instance
    auto example = ${projectData.name}::Factory::create();
    
    // Use the example
    example->doSomething();
    
    std::cout << "Example completed successfully!" << std::endl;
    return 0;
}
`;
  }
}

module.exports = ProjectGenerator;
