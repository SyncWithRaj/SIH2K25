import Roadmap from '@/models/Roadmap';
import connectMongo from "@/lib/mongodb";
import { NextResponse } from 'next/server';

// Handler for creating a new roadmap
export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { userId, nodes, edges } = body;

    // Validate incoming data
    if (!userId || !nodes || !edges) {
      return NextResponse.json({ message: 'User ID, nodes, and edges are required.' }, { status: 400 });
    }

    // Check if a roadmap for this user already exists to prevent duplicates
    const existingRoadmap = await Roadmap.findOne({ userId });
    if (existingRoadmap) {
      return NextResponse.json({ message: 'Roadmap already exists for this user. Use PUT to update.' }, { status: 409 }); // 409 Conflict
    }

    const newRoadmap = await Roadmap.create({ userId, nodes, edges });

    return NextResponse.json({
      success: true,
      data: newRoadmap,
      message: 'Roadmap saved successfully!',
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/roadmap/save Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to save roadmap.',
      error: error.message,
    }, { status: 500 });
  }
}

// Handler for updating an existing roadmap
export async function PUT(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { userId, nodes, edges } = body;

    // Validate incoming data
    if (!userId || !nodes || !edges) {
      return NextResponse.json({ message: 'User ID, nodes, and edges are required.' }, { status: 400 });
    }

    // This operation finds a roadmap by userId and updates it. 
    // If it doesn't exist, `upsert: true` will create it.
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { userId: userId },             // Find document by userId
      { $set: { nodes, edges } },      // Use $set to update only the specified fields
      { 
        new: true,                    // Return the updated document after the update
        upsert: true,                 // Create the document if it doesn't exist
        runValidators: true,          // ✅ Ensures schema validation rules are applied on update
      } 
    );

    return NextResponse.json({
      success: true,
      data: updatedRoadmap,
      message: 'Roadmap updated successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('PUT /api/roadmap/save Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update roadmap.',
      error: error.message,
    }, { status: 500 });
  }
}

