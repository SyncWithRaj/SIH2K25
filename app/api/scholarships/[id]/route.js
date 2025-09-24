import connectDB from '@/lib/mongodb';
import Scholarship from '@/models/Scholarship';
import { NextResponse } from 'next/server';

// PUT: Update a specific scholarship
export async function PUT(request, { params }) {
  await connectDB();
  try {
    const body = await request.json();
    const scholarship = await Scholarship.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!scholarship) {
      return NextResponse.json({ success: false, error: 'Scholarship not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: scholarship });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a specific scholarship
export async function DELETE(request, { params }) {
  await connectDB();
  try {
    const deletedScholarship = await Scholarship.findByIdAndDelete(params.id);
    if (!deletedScholarship) {
      return NextResponse.json({ success: false, error: 'Scholarship not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}