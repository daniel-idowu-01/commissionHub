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
        status: "in_stock",
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

// get user products
export async function GET(request: Request) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }
    try {
      let products;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      const user = await getUserById(decoded.id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      products = await Product.find({ sellerId: user.id });

      products = products.map((product) => product.toJSON());

      return NextResponse.json(products, { status: 200 });
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

export async function PUT(request: Request) {
  try {
    await connectDB();
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

      const body = await request.json();
      const { id, ...updateData } = body;

      if (!id) {
        return NextResponse.json(
          { error: "Product ID is required" },
          { status: 400 }
        );
      }

      // Prevent updating protected fields
      const { sellerId, _id, __v, ...safeUpdateData } = updateData;

      // Verify product exists and belongs to user
      const product = await Product.findOne({ _id: id, sellerId: user.id });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found or not owned by user" },
          { status: 404 }
        );
      }

      // Perform the update
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

    // Handle JWT errors
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

    // Handle body parsing errors
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
export async function DELETE(request: Request) {
  try {
    await connectDB();
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

      const { id } = await request.json();

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
