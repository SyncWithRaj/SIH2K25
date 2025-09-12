import connectMongo from "@/lib/mongodb";
import PersonalDetail from "@/models/PersonalDetail";

export async function GET(req) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const exists = await PersonalDetail.exists({ userId });
  return new Response(JSON.stringify({ exists }), { status: 200 });
}

export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const { userId, name, age, gender } = body;

    // Check if already exists
    const existing = await PersonalDetail.findOne({ userId });
    if (existing) {
      return new Response(JSON.stringify({ message: "Already exists" }), { status: 400 });
    }

    const newDetail = await PersonalDetail.create({ userId, name, age, gender });
    return new Response(JSON.stringify(newDetail), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
