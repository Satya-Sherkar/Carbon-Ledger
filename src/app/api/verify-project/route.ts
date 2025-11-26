import { Project } from "@/app/models/project";
import connectDB from "@/lib/connectDb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (mongoose.connection.readyState !== 1) { 
    await connectDB();
  }

  try {
    const { projectId, creditsToMint } = await req.json();

    // validations
    if (!projectId || !creditsToMint) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // find the project
    const project = await Project.findOne({ projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // update the project
    project.isVerified = true;
    project.credits = creditsToMint;
    await project.save();

    return NextResponse.json({ message: "Project verified successfully", project }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to verify project" }, { status: 500 });
  }
}