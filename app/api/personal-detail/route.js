import connectMongo from "@/lib/mongodb";
import PersonalDetail from "@/models/PersonalDetail";
import { clerkClient } from "@clerk/nextjs/server";

// This GET function fetches the complete user profile.
// It creates a basic profile if one doesn't exist.
export async function GET(req) {
  await connectMongo();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return new Response(JSON.stringify({ message: "User ID required" }), { status: 400 });

    let profile = await PersonalDetail.findOne({ userId });

    if (!profile) {
      const user = await clerkClient.users.getUser(userId);
      profile = await PersonalDetail.create({
        userId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.emailAddresses[0]?.emailAddress || "",
      });
    }
    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (err) {
    console.error("GET Profile Error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

// ✅ FIXED POST FUNCTION
// This function now correctly saves the entire profile, including nested objects.
export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const { userId, ...profileData } = body; // This captures ALL fields except userId
    if (!userId) return new Response(JSON.stringify({ message: "User ID required" }), { status: 400 });

    // The '$set' operator updates only the fields provided in profileData.
    // This correctly handles the nested 'educationDetails' object.
    const updatedProfile = await PersonalDetail.findOneAndUpdate(
      { userId: userId },
      { $set: profileData }, 
      { new: true, upsert: true, runValidators: true }
    );
    
    return new Response(JSON.stringify(updatedProfile), { status: 200 });
  } catch (err) {
    console.error("❌ API Error:", err);
    // Provide more specific error details for debugging if it's a validation error
    if (err.name === 'ValidationError') {
      return new Response(JSON.stringify({ message: err.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "An internal server error occurred" }), { status: 500 });
  }
}
