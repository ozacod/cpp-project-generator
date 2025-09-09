import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, deleteProject } from '@/lib/database'

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectName = searchParams.get('name')
    
    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }
    
    const result = await deleteProject(projectName)
    
    if (!result.deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Project ${projectName} deleted successfully` 
    })
    
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
