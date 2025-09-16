import Roadmap from '@/models/Roadmap';
import connectMongo from "@/lib/mongodb";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is missing.' }, { status: 400 });
    }

    const roadmap = await Roadmap.findOne({ userId: userId });

    // If no roadmap is found, return null data. The frontend will handle this.
    if (!roadmap) {
      return NextResponse.json({ success: true, data: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      data: roadmap,
      message: 'Roadmap loaded successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to load roadmap:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to load roadmap.',
      error: error.message,
    }, { status: 500 });
  }
}