import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Fixture from '@/models/Fixture';

// GET all fixtures
export async function GET() {
  try {
    await connectDB();
    const fixtures = await Fixture.find({}).sort({ createdAt: 1 });
    return NextResponse.json(fixtures);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create new fixture
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const fixture = await Fixture.create(body);
    return NextResponse.json(fixture, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}