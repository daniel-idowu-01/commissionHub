import jwt from "jsonwebtoken";
import User from "@/models/User";
import logger from "@/lib/logger";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

//////////////////////////////
// to fetch specific product
//////////////////////////////
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    logger.info("Fetching product...");
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
      .populate({
        path: "sellerId",
        select: "name createdAt",
        model: User,
      })
      .populate({
        path: "reviews",
        model: "Review",
        populate: {
          path: "userId",
          select: "name",
          model: "User",
        },
      });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found!" },
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
    logger.error("Error fetching product... " + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
