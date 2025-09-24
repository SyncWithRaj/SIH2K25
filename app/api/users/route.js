// app/api/users/route.js

import connectMongo from "@/lib/mongodb";
import PersonalDetail from "@/models/PersonalDetail";
// import { getAuth } from "@clerk/nextjs/server"; // Uncomment for production auth

export async function GET(req) {
  await connectMongo();

  /* ------------- PRODUCTION SECURITY (Enable in prod) -------------
  const { userId, sessionClaims } = getAuth(req);
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  ------------------------------------------------------------------ */

  try {
    // Fetch all users with full schema fields
    const users = await PersonalDetail.find({})
      .sort({ createdAt: -1 }) // latest first
      .select(
        "userId name email mobile dob gender role city courseInterested educationDetails hasCompletedOnboarding createdAt updatedAt"
      ) // explicitly select all schema fields
      .lean();

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error("GET All Users Error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
