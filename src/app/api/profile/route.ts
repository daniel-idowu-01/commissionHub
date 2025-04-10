import jwt from "jsonwebtoken";
import User from "@/models/User";
import logger from "@/lib/logger";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

//get user profile
export async function GET(request: Request) {
  try {
    logger.info("Fetching user profile...");
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

      const user = await User.findById(decoded.id);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
      };

      return NextResponse.json(userData, { status: 200 });
    } catch (error) {
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
    logger.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
      const { firstName, lastName, bio } = await request.json();

      const user = await User.findByIdAndUpdate(
        decoded.id,
        { name: `${firstName} ${lastName}`, firstName, lastName, bio },
        { new: true }
      );

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
      };

      return NextResponse.json(
        { message: "Profile updated successfully", user: userData },
        { status: 200 }
      );
    } catch (error) {
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
    logger.error("Profile update error: " + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
