import jwt from "jsonwebtoken";
import User from "@/models/User";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// get all products
export async function GET(request: Request) {
  try {
    await connectDB();

    try {
      let products;

      products = await Product.find({}).populate({
        path: "sellerId",
        select: "name",
        model: User
      });

      products = products.map((product) => product.toJSON());

      return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
      console.log(33, error)
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
