import { NextRequest, NextResponse } from 'next/server'
import { getProject } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectName = searchParams.get('name')
    
    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }
    
    // Get project from database
    const project = await getProject(projectName)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Return zip file
    return new NextResponse(project.zip_data, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName}.zip"`,
        'Content-Length': project.zip_data.length.toString(),
      },
    })
    
  } catch (error) {
    console.error('Error downloading project:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}