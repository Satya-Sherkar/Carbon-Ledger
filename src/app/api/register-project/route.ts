import { IProject, Project } from "@/app/models/project";
import { User } from "@/app/models/user";
import connectDB from "@/lib/connectDb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

  if (mongoose.connection.readyState !== 1) { 
    await connectDB();
  }
  
    try {
      const { title, description, ownerEmail, ownerWalletAddress, projectId } =
        await req.json();
      
      // validations
      if (!title || !description || !ownerEmail || !ownerWalletAddress || !projectId) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }
      // find the owner by email. Owner needs to be a registered user
      const owner = await User.findOne({ email: ownerEmail });
      if (!owner) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 });
      }

      // create the project
      const project: IProject = new Project({
        title,
        description,
        owner: owner,
        ownerWalletAddress,
        projectId,
      });

      await project.save();
      return NextResponse.json(
        { message: "Project registered successfully", project },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error registering project:", error);
      return NextResponse.json(
        { error: "Failed to register project" },
        { status: 500 }
      );
    }
}
