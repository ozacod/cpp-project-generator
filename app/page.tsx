'use client'

import { useState, useEffect } from 'react'
import ProjectForm from '@/components/ProjectForm'
import ProjectList from '@/components/ProjectList'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        const projects = data.projects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt)
        }))
        setProjects(projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [...prev, project])
    setShowForm(false)
  }

  const handleDeleteProject = async (projectName: string) => {
    try {
      const response = await fetch(`/api/projects?name=${projectName}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.name !== projectName))
      } else {
        console.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Generate C++ Projects
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Create modern C++ libraries and applications with proper CMake structure,
            CPM dependency management, local caching, Git LFS support, and Google Test integration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Modern C++</h3>
              <p className="text-sm text-blue-700">C++17/20/23 support with CMake 3.20+</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📦 Smart Dependencies</h3>
              <p className="text-sm text-green-700">CPM with local caching & Git LFS</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🧪 Testing Ready</h3>
              <p className="text-sm text-purple-700">Google Test integration included</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Project
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              View Projects
            </button>
          </div>

          {showForm ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Project</h3>
              <ProjectForm onProjectCreated={handleProjectCreated} />
            </div>
          ) : (
            <ProjectList 
              projects={projects} 
              onDeleteProject={handleDeleteProject}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export interface Project {
  id: string
  name: string
  type: 'library' | 'application'
  dependencies: string[]
  cppStandard: string
  cmakeVersion: string
  includeTests: boolean
  includeExamples: boolean
  createdAt: Date
  status: 'created' | 'building' | 'ready' | 'error'
}
