import connectMongo from "@/lib/mongodb";
import PersonalDetail from "@/models/PersonalDetail";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req) {
  await connectMongo();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return new Response(JSON.stringify({ message: "User ID required" }), { status: 400 });

    let profile = await PersonalDetail.findOne({ userId });

    // If no profile exists, create a starter profile from Clerk data
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

export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const { userId, ...profileData } = body;
    if (!userId) return new Response(JSON.stringify({ message: "User ID required" }), { status: 400 });

    // Create the update object
    const updateData = { ...profileData };

    // If the role is being submitted, it's from the initial form.
    // So, we mark onboarding as complete.
    if (profileData.role) {
      updateData.hasCompletedOnboarding = true;
    }

    const updatedProfile = await PersonalDetail.findOneAndUpdate(
      { userId: userId },
      { $set: updateData }, 
      { new: true, upsert: true, runValidators: true }
    );
    
    return new Response(JSON.stringify(updatedProfile), { status: 200 });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(JSON.stringify({ message: "An internal server error occurred" }), { status: 500 });
  }
}