import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all players
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("friendship_cup");
    const players = await db.collection("players").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: players 
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST new player
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Player name is required' 
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("friendship_cup");
    
    const newPlayer = {
      name: body.name.trim(),
      position: body.position || 'Striker',
      category: body.category || 'A',
      teamId: body.teamId || '',
      teamName: body.teamName || null,
      isCaptain: body.isCaptain || false,
      goals: Number(body.goals) || 0,
      assists: Number(body.assists) || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("players").insertOne(newPlayer);
    
    return NextResponse.json({ 
      success: true, 
      data: { ...newPlayer, _id: result.insertedId } 
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE player
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Player ID required' 
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("friendship_cup");
    
    const result = await db.collection("players").deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Player not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Player deleted' 
    });
    
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// UPDATE player
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Player ID required' 
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("friendship_cup");
    
    updateData.updatedAt = new Date();
    
    const result = await db.collection("players").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Player not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Player updated' 
    });
    
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}