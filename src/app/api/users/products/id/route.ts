import jwt from "jsonwebtoken";
import logger from "@/lib/logger";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/services/userService";

//////////////////////////////
// to update specific product
//////////////////////////////
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    logger.info("Updating product...");
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

      const updateData = await request.json();

      const product = await Product.findOne({ _id: id, sellerId: user.id });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found or not owned by user" },
          { status: 404 }
        );
      }

      const { sellerId, _id, __v, ...safeUpdateData } = updateData;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        safeUpdateData,
        {
          new: true,
        }
      );

      if (!updatedProduct) {
        return NextResponse.json(
          { error: "Product update failed" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: "Product updated successfully",
          product: updatedProduct,
        },
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
  } catch (error: any) {
    logger.error("Error updating product: " + error);
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
