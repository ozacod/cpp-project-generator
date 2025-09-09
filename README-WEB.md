# C++ Project Generator Web Interface

A modern web interface for the C++ Project Generator, built with Next.js and minimal dependencies.

## Features

- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- ⚡ **Real-time Generation**: Generate C++ projects directly from the web interface
- 📦 **Project Management**: View, build, and manage your generated projects
- 🔧 **Interactive Forms**: Easy-to-use forms for project configuration
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zero External Dependencies**: Only uses Next.js built-in features

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.6+ (for the C++ project generator)
- CMake 3.20+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the Python script is executable:
```bash
chmod +x cpp_project_generator.py
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Projects

1. Click "Create New Project" on the home page
2. Fill out the project form:
   - **Project Name**: Use snake_case (e.g., `my_awesome_lib`)
   - **Project Type**: Choose Library or Application
   - **Dependencies**: Comma-separated list (e.g., `spdlog@1.14.1,nlohmann/json@3.12.0`)
   - **C++ Standard**: Choose C++17, C++20, or C++23
   - **CMake Version**: Specify minimum CMake version
   - **Features**: Enable/disable tests and examples

3. Click "Generate Project" to create the project

### Managing Projects

- View all projects on the Projects page
- Build projects directly from the web interface
- Delete projects you no longer need
- Track project status (Created, Building, Ready, Error)

## API Endpoints

### POST /api/generate
Generate a new C++ project.

**Request Body:**
```json
{
  "name": "my_lib",
  "type": "library",
  "dependencies": "spdlog@1.14.1,nlohmann/json@3.12.0",
  "cppStandard": "23",
  "cmakeVersion": "3.20",
  "includeTests": true,
  "includeExamples": false
}
```

### POST /api/build
Build an existing project.

**Request Body:**
```json
{
  "projectName": "my_lib"
}
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── generate/      # Project generation endpoint
│   │   └── build/         # Project building endpoint
│   ├── projects/          # Projects page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ProjectCard.tsx    # Project display card
│   ├── ProjectForm.tsx    # Project creation form
│   └── ProjectList.tsx    # Project list display
├── cpp_project_generator.py # Python CLI tool
└── package.json           # Dependencies
```

## Development

### Adding New Features

1. **New UI Components**: Add to `components/` directory
2. **New API Endpoints**: Add to `app/api/` directory
3. **New Pages**: Add to `app/` directory

### Styling

The project uses Tailwind CSS for styling. Key classes:
- `bg-blue-600`: Primary blue color
- `text-gray-900`: Dark text
- `rounded-lg`: Rounded corners
- `shadow-md`: Card shadows
- `hover:bg-blue-700`: Hover effects

### State Management

The app uses React's built-in state management:
- `useState` for component state
- `localStorage` for persistence
- No external state management library needed

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Troubleshooting

### Common Issues

1. **Python script not found**: Ensure `cpp_project_generator.py` is executable
2. **Build failures**: Check that CMake and required dependencies are installed
3. **Permission errors**: Ensure the web server has write permissions

### Debug Mode

Enable debug logging by setting environment variables:
```bash
DEBUG=1 npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
