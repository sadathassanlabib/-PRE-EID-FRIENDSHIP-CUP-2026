import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Player from '@/models/Player';

// GET - fetch all players or single player
export async function GET(req, { params }) {
  try {
    await connectDB();
    
    // If params.id exists, fetch single player
    if (params?.id) {
      const player = await Player.findById(params.id);
      if (!player) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }
      return NextResponse.json(player);
    }
    
    // Otherwise fetch all players
    const players = await Player.find({}).sort({ createdAt: -1 });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create new player
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }
    
    const player = await Player.create(body);
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT - update player
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }
    
    const player = await Player.findByIdAndUpdate(
      params.id, 
      body, 
      { 
        new: true,           // Return the updated document
        runValidators: true  // Run model validations
      }
    );
    
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - remove player
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const player = await Player.findByIdAndDelete(params.id);
    
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Player deleted successfully',
      deletedPlayer: player 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}