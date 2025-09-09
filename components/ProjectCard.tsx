'use client'

import { Project } from '@/app/page'

interface ProjectCardProps {
  project: Project
  onDelete: (projectName: string) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-gray-100 text-gray-800'
      case 'building': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Created'
      case 'building': return 'Building...'
      case 'ready': return 'Ready'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{project.type}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {getStatusText(project.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">C++ Standard:</span> C++{project.cppStandard}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">CMake:</span> {project.cmakeVersion}
        </div>
        {project.dependencies.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Dependencies:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.dependencies.map((dep, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Features:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.includeTests && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Tests
              </span>
            )}
            {project.includeExamples && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                Examples
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-4">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>

      <div className="flex space-x-2">
        <a
          href={`/api/download?name=${project.name}`}
          download={`${project.name}.zip`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded text-center"
        >
          Download Zip
        </a>
        <button
          onClick={() => onDelete(project.name)}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
