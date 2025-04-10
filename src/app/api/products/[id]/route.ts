import jwt from "jsonwebtoken";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

//////////////////////////////
// to fetch specific product
//////////////////////////////
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    try {
      const product = await Product.findById(id).populate({
        path: "sellerId",
        select: "name",
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product fetch failed" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: "Product fetched successfully",
          product,
        },
        { status: 200 }
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
  } catch (error: any) {
    console.error("Error:", error);
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

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
