import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
      const { currentPassword, newPassword, confirmPassword } =
        await request.json();

      const user = await User.findById(decoded.id);

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Current Password is incorrect!" },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          {
            message: "Confirm password does not match with your new password",
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
      console.error("Profile update error:", error);

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
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
