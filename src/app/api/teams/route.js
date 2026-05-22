import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all teams
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("friendship_cup")
    const teams = await db.collection("teams").find({}).sort({ name: 1 }).toArray()
    
    return NextResponse.json({ success: true, data: teams })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST new team
export async function POST(request) {
  try {
    const body = await request.json()
    
    const client = await clientPromise
    const db = client.db("friendship_cup")
    
    const newTeam = {
      name: body.name,
      shortName: body.shortName,
      color: body.color,
      logo: body.logo || '⚽',
      founded: body.founded,
      stadium: body.stadium,
      coach: body.coach,
      captain: body.captain,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("teams").insertOne(newTeam)
    
    return NextResponse.json({ success: true, data: { ...newTeam, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT update team
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const client = await clientPromise
    const db = client.db("friendship_cup")
    
    updateData.updatedAt = new Date()
    
    const result = await db.collection("teams").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Team updated' })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE team
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Team ID required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db("friendship_cup")
    
    const result = await db.collection("teams").deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Team not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Team deleted' })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}