import connectDB from "@/lib/connectDb";
import { User } from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, creditsToRetire } = await req.json();

    // validations
    if (!userId || !creditsToRetire) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // check if user has enough credits
    if (user.credits < creditsToRetire) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // update the user's credits
    user.credits -= creditsToRetire;
    user.creditsRetired += creditsToRetire;
    await user.save();

    return NextResponse.json(
      { message: "Credits retired successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retire credits" },
      { status: 500 }
    );
  }
}
