import { User } from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/connectDb";

interface SignUpRequestBody {
  name: string;
  email: string;
  clerkId: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Parse and type the request body
    const { name, email, clerkId } =
      (await req.json()) as SignUpRequestBody;

    // Validate required fields - ensure defined and non-empty after trimming
    if (
      [name, email, clerkId].some(
        (field) => !field || field.trim() === ""
      )
    ) {
      return NextResponse.json(
        { error: "All fields are necessary" },
        { status: 400 }
      );
    }

    // Check if user exists with clerkId or email
    const existingUser = await User.findOne({
      $or: [{ clerkId }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with same credentials already exists" },
        { status: 409 }
      );
    }

    // Create new user document with email lowercase for consistency
    const user = new User({
      name,
      email: email.toLowerCase(),
      clerkId,
    });

    await user.save();

    // Return success with correct property spelling
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          name,
          email: email.toLowerCase(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
  }
}
