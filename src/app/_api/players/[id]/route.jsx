import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Player from '@/models/Player';

// GET all players
export async function GET() {
  try {
    await connectDB();
    const players = await Player.find({}).sort({ category: 1, name: 1 });
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
    const player = await Player.create(body);
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}