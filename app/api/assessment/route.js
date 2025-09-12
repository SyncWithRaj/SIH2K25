import connectMongo from "@/lib/mongodb";
import Assessment from "@/models/Assessment";

export async function GET(req) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const exists = await Assessment.exists({ userId });
  return new Response(JSON.stringify({ exists }), { status: 200 });
}

export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const { userId, answers } = body;

    // Optional: update if already exists
    const existing = await Assessment.findOne({ userId });
    if (existing) {
      existing.answers = answers;
      await existing.save();
      return new Response(JSON.stringify(existing), { status: 200 });
    }

    const newAssessment = await Assessment.create({ userId, answers });
    return new Response(JSON.stringify(newAssessment), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
