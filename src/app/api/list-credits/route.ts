import { Project } from "@/app/models/project";
import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { creditAmount, pricePerCredit, projectId } = await req.json();

    // validations
    if (
      creditAmount === undefined ||
      pricePerCredit === undefined ||
      projectId === undefined
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const project = await Project.findOne({ projectId: projectId });
    if (!project) {
      return NextResponse.json(
        { error: "Project not found. Register your project first." },
        { status: 404 }
      );
    }
    if (project.credits < creditAmount) {
      return NextResponse.json(
        { error: "Insufficient credits to list" },
        { status: 400 }
      );
    }

    // update project listing status
    project.credits = project.credits - creditAmount;
    project.pricePerCredit = pricePerCredit;
    project.isListed = true;

    await project.save();

    return NextResponse.json(
      { message: "Credits listed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list credits" },
      { status: 500 }
    );
  }
}
