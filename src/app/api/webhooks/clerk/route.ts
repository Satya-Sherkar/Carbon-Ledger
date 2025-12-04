import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/user";
import connectDB from "@/lib/connectDb";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { type, data } = evt;

    if (type === "user.created") {
      const user = data;

      const userId = user.id;
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";

      const primaryEmail = user.email_addresses.find(
        (e) => e.id === user.primary_email_address_id
      )?.email_address;

      // Validate required fields
      if (!userId || !primaryEmail) {
        console.error("Missing required fields: userId or email");
        return NextResponse.json(
          { error: "Missing required user data" },
          { status: 400 }
        );
      }

      // Connect to MongoDB
      await connectDB();

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ clerkId: userId }, { email: primaryEmail.toLowerCase() }],
      });

      if (existingUser) {
        console.log(`User already exists: ${primaryEmail}`);
        return NextResponse.json(
          { message: "User already exists" },
          { status: 200 }
        );
      }

      // Create new user
      const name =
        `${firstName} ${lastName}`.trim();

      const newUser = new User({
        name,
        email: primaryEmail.toLowerCase(),
        clerkId: userId,
      });

      await newUser.save();

      console.log(`User created successfully: ${primaryEmail}`);
      return NextResponse.json(
        { message: "User saved successfully", userId: newUser._id },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      {
        error: "Error processing webhook",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
