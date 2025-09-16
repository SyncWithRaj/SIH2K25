import Roadmap from '@/models/Roadmap';
import connectMongo from "@/lib/mongodb";
import { NextResponse } from 'next/server';

// Handler for creating a new roadmap
export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { userId, nodes, edges } = body;

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    // Check if a roadmap for this user already exists
    const existingRoadmap = await Roadmap.findOne({ userId });
    if (existingRoadmap) {
        return NextResponse.json({ message: 'Roadmap already exists. Use PUT to update.' }, { status: 409 });
    }

    const newRoadmap = await Roadmap.create({ userId, nodes, edges });

    return NextResponse.json({
      success: true,
      data: newRoadmap,
      message: 'Roadmap saved successfully!',
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to save roadmap:', error);
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

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }

    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { userId: userId }, // Find document by userId
      { nodes: nodes, edges: edges }, // Data to update
      { new: true, upsert: true } // Options: return the updated doc, and create if it doesn't exist
    );

    return NextResponse.json({
      success: true,
      data: updatedRoadmap,
      message: 'Roadmap updated successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to update roadmap:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update roadmap.',
      error: error.message,
    }, { status: 500 });
  }
}