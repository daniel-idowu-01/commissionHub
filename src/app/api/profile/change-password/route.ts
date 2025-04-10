import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import logger from "@/lib/logger";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { passwordRegex } from "@/lib/constants";

export async function PUT(request: Request) {
  try {
    logger.info("Updating user password...");
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
      const { currentPassword, newPassword, confirmPassword } =
        await request.json();

      const user = await User.findById(decoded.id);

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current Password is incorrect!" },
          { status: 400 }
        );
      }

      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json(
          {
            message:
              "Password must have at least one uppercase, one lowercase, one number, one symbol, and be more than 8 characters!",
          },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await User.findByIdAndUpdate(decoded.id, {
        $set: {
          password: hashedPassword,
        },
      });

      return NextResponse.json(
        { message: "Password updated successfully", user: updatedUser.email },
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
          { error: "Unauthorized - Token expired" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("Error updating password: " + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
