import jwt from "jsonwebtoken";
import User from "@/models/User";
import logger from "@/lib/logger";
import Product from "@/models/Product";
import Reviews from "@/models/Reviews";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// get all products
export async function GET(request: Request) {
  try {
    logger.info("Fetching all products...");
    await connectDB();

    let products;
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    if (category) {
      products = await Product.find({ category })
        .populate({
          path: "sellerId",
          select: "name",
          model: User,
        })
        .populate({
          path: "reviews",
          model: Reviews,
          populate: {
            path: "userId",
            select: "name",
            model: User,
          },
        });

      products = products.map((product) => product.toJSON());

      return NextResponse.json(products, { status: 200 });
    }

    products = await Product.find({})
      .populate({
        path: "sellerId",
        select: "name",
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

    products = products.map((product) => product.toJSON());

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    logger.error("Error fetching all products: " + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
