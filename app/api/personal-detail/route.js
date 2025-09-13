import connectMongo from "@/lib/mongodb";
import PersonalDetail from "@/models/PersonalDetail";

export async function GET(req) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ exists: false }), { status: 200 });
  }

  const userDetail = await PersonalDetail.findOne({ userId }).lean();

  if (!userDetail) {
    return new Response(JSON.stringify({ exists: false }), { status: 200 });
  }

  return new Response(
    JSON.stringify({
      exists: true,
      role: userDetail.role, // 👈 now you’ll get role back
    }),
    { status: 200 }
  );
}

export async function POST(req) {
  await connectMongo();
  try {
    const body = await req.json();
    const { userId, name, age, gender, role } = body;

    console.log("📥 Incoming PersonalDetail:", body);

    const existing = await PersonalDetail.findOne({ userId });
    if (existing) {
      return new Response(JSON.stringify({ message: "Already exists" }), {
        status: 400,
      });
    }

    const newDetail = await PersonalDetail.create({
      userId,
      name,
      age: Number(age), // 👈 ensure age saved as Number
      gender,
      role,
    });

    console.log("✅ Saved PersonalDetail:", newDetail);

    return new Response(JSON.stringify(newDetail), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
