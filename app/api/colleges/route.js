import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect(); // Ensure DB connection

        // Fetch all colleges and sort them by name
        const colleges = await College.find({}).sort({ name: 1 });

        return NextResponse.json({
            message: "Colleges fetched successfully",
            success: true,
            data: colleges,
        });

    } catch (error) {
        return NextResponse.json({
            message: "Failed to fetch colleges",
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

