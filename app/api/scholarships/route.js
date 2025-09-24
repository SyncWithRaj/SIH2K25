import connectDB from '@/lib/mongodb'; // Your database connection utility
import Scholarship from '@/models/Scholarship';
import { NextResponse } from 'next/server';

// GET: Fetch all scholarships
export async function GET() {
  await connectDB();
  try {
    const scholarships = await Scholarship.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: scholarships });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST: Create a new scholarship
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const scholarship = await Scholarship.create(body);
    return NextResponse.json({ success: true, data: scholarship }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}