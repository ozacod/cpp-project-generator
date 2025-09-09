'use client'

import { useState } from 'react'
import { Project } from '@/app/page'

interface ProjectFormProps {
  onProjectCreated: (project: Project) => void
}

export default function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'library' as 'library' | 'application',
    dependencies: '',
    cppStandard: '23',
    cmakeVersion: '3.20',
    includeTests: true,
    includeExamples: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedProject, setGeneratedProject] = useState<{name: string, zipPath: string} | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        
        const project: Project = {
          id: result.projectId.toString(),
          name: formData.name,
          type: formData.type,
          dependencies: formData.dependencies ? formData.dependencies.split(',').map(d => d.trim()) : [],
          cppStandard: formData.cppStandard,
          cmakeVersion: formData.cmakeVersion,
          includeTests: formData.includeTests,
          includeExamples: formData.includeExamples,
          createdAt: new Date(),
          status: 'created'
        }

        onProjectCreated(project)

        // Set generated project for download
        setGeneratedProject({
          name: formData.name,
          zipPath: result.zipPath
        })

        // Reset form
        setFormData({
          name: '',
          type: 'library',
          dependencies: '',
          cppStandard: '23',
          cmakeVersion: '3.20',
          includeTests: true,
          includeExamples: false
        })
      } else {
        console.error('Failed to generate project')
      }
    } catch (error) {
      console.error('Error generating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="my_awesome_lib"
          />
          <p className="text-sm text-gray-500 mt-1">Use snake_case naming convention</p>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Project Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="library">Library</option>
            <option value="application">Application</option>
          </select>
        </div>

        <div>
          <label htmlFor="dependencies" className="block text-sm font-medium text-gray-700 mb-2">
            Dependencies
          </label>
          <textarea
            id="dependencies"
            name="dependencies"
            value={formData.dependencies}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="spdlog@1.14.1, nlohmann/json@3.12.0, curl"
          />
          <div className="text-sm text-gray-500 mt-1">
            <p className="mb-1">Supports: spdlog@1.14.1, user/repo@tag, https://github.com/user/repo.git@tag</p>
            <p className="text-xs text-blue-600">
              💡 Dependencies are stored locally in the project directory and can be managed with Git LFS
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cppStandard" className="block text-sm font-medium text-gray-700 mb-2">
              C++ Standard
            </label>
            <select
              id="cppStandard"
              name="cppStandard"
              value={formData.cppStandard}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="17">C++17</option>
              <option value="20">C++20</option>
              <option value="23">C++23</option>
            </select>
          </div>

          <div>
            <label htmlFor="cmakeVersion" className="block text-sm font-medium text-gray-700 mb-2">
              CMake Version
            </label>
            <input
              type="text"
              id="cmakeVersion"
              name="cmakeVersion"
              value={formData.cmakeVersion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeTests"
              name="includeTests"
              checked={formData.includeTests}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeTests" className="ml-2 block text-sm text-gray-700">
              Include Google Test framework
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeExamples"
              name="includeExamples"
              checked={formData.includeExamples}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeExamples" className="ml-2 block text-sm text-gray-700">
              Include example code
            </label>
          </div>
        </div>

        {generatedProject && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Project generated successfully!
                </h3>
                <p className="text-xs text-green-700 mt-1">
                  Includes CPMConfig.cmake for local dependency management and Git LFS support
                </p>
                <div className="mt-2">
                  <a
                    href={`/api/download?name=${generatedProject.name}`}
                    download={generatedProject.zipPath}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download {generatedProject.zipPath}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onProjectCreated({} as Project)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          >
            {isSubmitting ? 'Generating...' : 'Generate Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
