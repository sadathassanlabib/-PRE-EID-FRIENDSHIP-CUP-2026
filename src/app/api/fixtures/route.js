import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all fixtures
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("friendship_cup")
    const fixtures = await db.collection("fixtures").find({}).sort({ date: 1, time: 1 }).toArray()
    
    return NextResponse.json({ success: true, data: fixtures })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST new fixture
export async function POST(request) {
  try {
    const body = await request.json()
    
    const client = await clientPromise
    const db = client.db("friendship_cup")
    
    const newFixture = {
      matchNumber: body.matchNumber,
      team1: body.team1,
      team2: body.team2,
      team1Id: body.team1Id,
      team2Id: body.team2Id,
      date: body.date,
      time: body.time,
      venue: body.venue,
      status: body.status || 'upcoming', // upcoming, live, completed
      score1: body.score1 || 0,
      score2: body.score2 || 0,
      winner: body.winner || null,
      round: body.round || 'group',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("fixtures").insertOne(newFixture)
    
    return NextResponse.json({ success: true, data: { ...newFixture, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT update fixture
export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const client = await clientPromise
    const db = client.db("friendship_cup")
    
    updateData.updatedAt = new Date()
    
    const result = await db.collection("fixtures").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Fixture not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Fixture updated' })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE fixture
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Fixture ID required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db("friendship_cup")
    
    const result = await db.collection("fixtures").deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Fixture not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Fixture deleted' })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}