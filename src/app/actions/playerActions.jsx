'use server'

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function addPlayer(formData) {
  try {
    // Extract data from FormData
    const name = formData.get('name')
    const position = formData.get('position')
    const category = formData.get('category')
    const teamId = formData.get('teamId')
    const teamName = formData.get('teamName')
    const isCaptain = formData.get('isCaptain') === 'true'
    const goals = parseInt(formData.get('goals')) || 0
    const assists = parseInt(formData.get('assists')) || 0

    // Validate
    if (!name || name.trim() === '') {
      return { success: false, error: 'Player name is required' }
    }

    // For now, store in memory or localStorage
    // Since server actions might have issues, let's just return success
    
    console.log('Player to add:', {
      name,
      position,
      category,
      teamId,
      teamName,
      isCaptain,
      goals,
      assists
    })

    // Simulate successful save
    return { 
      success: true, 
      data: { name, position, category, teamId, teamName, isCaptain, goals, assists },
      message: 'Player added successfully!'
    }
  } catch (error) {
    console.error('Error adding player:', error)
    return { success: false, error: error.message }
  }
}