import jwt from "jsonwebtoken";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

export async function POST(request: Request) {
  try {
    await connectDB();
    // const user = getUser(request);

    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      const user = await getUserById(decoded.id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const {
        name,
        description,
        basePrice,
        recommendedPrice,
        inventory,
        category,
        images,
      } = await request.json();

      const newProduct = await Product.create({
        name,
        description,
        basePrice,
        recommendedPrice,
        inventory,
        category,
        allowReselling: true,
        status: "In stock",
        tags: [],
        sellerId: user.id,
        productImages: images,
      });

      if (!newProduct) {
        return NextResponse.json(
          { error: "Product creation failed" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Product created successfully" },
        { status: 201 }
      );
    } catch (error: any) {
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid token" },
          { status: 401 }
        );
      }

      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          { error: "Token expired. Please login again." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
