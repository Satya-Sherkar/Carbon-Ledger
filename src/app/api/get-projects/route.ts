import { Project } from "@/app/models/project";
import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Extract ownerWalletAddress from URL query parameters
    const ownerWalletAddress = request.nextUrl.searchParams.get("ownerWalletAddress");

    // Validate that the parameter is provided
    if (!ownerWalletAddress) {
        return NextResponse.json(
            { error: "ownerWalletAddress is required" },
            { status: 400 }
        );
    }

    try {
        await connectDB();
        const projects = await Project.find({ ownerWalletAddress });
        return NextResponse.json({ projects }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
