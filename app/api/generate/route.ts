import { NextRequest, NextResponse } from 'next/server'
import { saveProject } from '@/lib/database'
import ProjectGenerator from '@/lib/projectGenerator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, dependencies, cppStandard, cmakeVersion, includeTests, includeExamples } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 })
    }

    // Parse dependencies
    const depsArray = dependencies ? dependencies.split(',').map(d => d.trim()).filter(d => d) : []

    const projectData = {
      name,
      type,
      dependencies: depsArray,
      cppStandard: cppStandard || '23',
      cmakeVersion: cmakeVersion || '3.20',
      includeTests: includeTests !== false,
      includeExamples: includeExamples === true
    }

    // Generate project
    const generator = new ProjectGenerator()
    const zipBuffer = await generator.generateProject(projectData)

    // Save to database
    const result = await saveProject(projectData, zipBuffer)

    return NextResponse.json({ 
      success: true, 
      message: `Project ${name} generated successfully`,
      projectId: result.id,
      zipPath: `${name}.zip`
    })

  } catch (error) {
    console.error('Error generating project:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}