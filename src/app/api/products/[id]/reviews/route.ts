import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import logger from "@/lib/logger";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Product from "@/models/Product";
import Reviews from "@/models/Reviews";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

//////////////////////////////
// to upload user review
//////////////////////////////
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    logger.info("Uploading review...");
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

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

      const { comment, rating } = await request.json();

      if (!comment || !rating) {
        return NextResponse.json(
          { error: "Comment and rating are required" },
          { status: 400 }
        );
      }

      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found or not owned by user" },
          { status: 404 }
        );
      }

      if (user.id.toString() === product.sellerId.toString()) {
        return NextResponse.json(
          { error: "You cannot review your own product" },
          { status: 400 }
        );
      }

      const reviews = await Reviews.create({
        productId: id,
        userId: user.id,
        comment,
        rating,
      });

      if (!reviews) {
        return NextResponse.json(
          { error: "Review creation failed" },
          { status: 400 }
        );
      }

      const reviewsCount = await Reviews.countDocuments({
        productId: id,
      });

      const totalRating = await Reviews.aggregate([
        {
          $match: { 
            productId: new mongoose.Types.ObjectId(id) // Ensure proper ObjectId conversion
          }
        },
        {
          $group: {
            _id: null,
            rating: { $sum: "$rating" },
            count: { $sum: 1 } // Add count to verify matches
          }
        }
      ]);

    //   if (totalRating.length === 0) {
    //     return NextResponse.json(
    //       { error: "No ratings found" },
    //       { status: 400 }
    //     );
    //   }

      const averageRating = Math.round(
        totalRating[0].rating / reviewsCount
      );

      await Product.findByIdAndUpdate(
        id,
        {
          $push: { reviews: reviews._id },
          $set: { averageRating },
        },
        { new: true }
      );

      return NextResponse.json(
        {
          message: "Review updated successfully",
        },
        { status: 200 }
      );
    } catch (error: any) {
      logger.error("Error: " + error);
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
    logger.error("Error uploading review: " + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//////////////////////////////
// to delete specific product
//////////////////////////////
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    logger.info("Deleting product...");
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

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

      const product = await Product.findOne({ _id: id, sellerId: user.id });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      await Product.findByIdAndDelete(id);

      return NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      logger.error("JWT Error: " + error);
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
    logger.error("Error deleting product: " + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
