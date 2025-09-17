import connectMongo from "@/lib/mongodb";
import Assessment from "@/models/Assessment"; // --- This import fixes the main error ---
import { NextResponse } from "next/server";

// This GET handler now correctly fetches a user's submitted assessment.
export async function GET(req) {
  await connectMongo();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const assessment = await Assessment.findOne({ userId: userId });

    if (!assessment) {
        return NextResponse.json({ message: "Assessment not found for this user" }, { status: 404 });
    }

    return NextResponse.json(assessment);

  } catch (err) {
    console.error("GET Assessment Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// This POST handler is now corrected to use NextResponse for consistency.
export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const { userId, answers } = body;

    if (!userId || !answers) {
      return NextResponse.json({ message: "Missing userId or answers" }, { status: 400 });
    }

    // This command will find an assessment by userId and update it,
    // or create a new one if it doesn't exist.
    const newOrUpdatedAssessment = await Assessment.findOneAndUpdate(
      { userId: userId },
      { userId, answers },
      { 
        new: true,
        upsert: true,
        runValidators: true 
      }
    );

    return NextResponse.json(newOrUpdatedAssessment, { status: 200 });

  } catch (err) {
    console.error("POST Assessment Error:", err);
    
    if (err.name === 'ValidationError') {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}