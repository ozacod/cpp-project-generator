'use client'

import { Project } from '@/app/page'
import ProjectCard from './ProjectCard'

interface ProjectListProps {
  projects: Project[]
  onDeleteProject: (projectName: string) => void
}

export default function ProjectList({ projects, onDeleteProject }: ProjectListProps) {

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No projects created yet</div>
        <p className="text-gray-400">Create your first C++ project using the form above</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  )
}
