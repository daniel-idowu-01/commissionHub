import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = getUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query");
  // give dummy users data and return it
  const users = [
    {
      id: 1,
      name: "Daniel",
    },
    {
      id: 2,
      name: "Idowu",
    },
  ];

  return new Response(JSON.stringify(query), {
    status: 200,
    headers: {
      "Content-Type": "applocation/json",
    },
  });
}

export async function POST(request: Request) {
  const { name } = await request.json();

  return new Response(
    JSON.stringify({ message: "Data retrieved successfully!", name }),
    {
      status: 200,
      headers: {
        "Content-Type": "applocation/json",
      },
    }
  );
}
