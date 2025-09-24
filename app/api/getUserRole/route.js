import connectDB from "@/lib/mongodb"; // your mongoose connection
import PersonalDetail from "@/models/PersonalDetail";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // pass Clerk userId
    if (!userId) return new Response(JSON.stringify({ error: "No userId provided" }), { status: 400 });

    await connectDB(); // ensure DB connection
    const personalDetail = await PersonalDetail.findOne({ userId }).lean();
    if (!personalDetail) return new Response(JSON.stringify({ role: null }), { status: 200 });

    return new Response(JSON.stringify({ role: personalDetail.role }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
