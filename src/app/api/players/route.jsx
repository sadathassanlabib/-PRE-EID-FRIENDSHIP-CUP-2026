import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Player from '@/models/Player';

// GET single player
export async function GET(req, { params }) {
  try {
    await connectDB();
    const player = await Player.findById(params.id);
    if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - update player
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const player = await Player.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });
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
    if (!player) return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}