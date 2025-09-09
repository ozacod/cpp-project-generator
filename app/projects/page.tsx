'use client'

import { useState, useEffect } from 'react'
import ProjectCard from '@/components/ProjectCard'
import { Project } from '@/app/page'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
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


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your C++ Projects</h1>
        <p className="text-gray-600 mb-4">
          Manage your generated C++ libraries and applications with local dependency caching
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📦 Dependency Management</h3>
          <p className="text-sm text-blue-700">
            All projects use CPMConfig.cmake for local dependency caching. 
            Dependencies are stored in <code>dependencies/</code> directory and can be managed with Git LFS.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No projects yet</div>
          <a 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Your First Project
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  )
}
