// app/api/users/route.js (example path in Next.js 13+ with App Router)

import connectMongo from "@/lib/mongodb";
import PersonalDetail from "@/models/PersonalDetail";
// import { getAuth } from "@clerk/nextjs/server"; // Uncomment for production auth

export async function GET(req) {
  await connectMongo();

  /* // --- PRODUCTION SECURITY ---
  const { userId, sessionClaims } = getAuth(req);

  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }
  */

  try {
    // Fetch all user profiles (full schema data) sorted by newest first
    const users = await PersonalDetail.find({})
      .sort({ createdAt: -1 })
      .lean(); // .lean() makes query faster & returns plain JS objects

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error("GET All Users Error:", err);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
