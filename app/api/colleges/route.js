import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import { NextResponse } from "next/server";

// GET all colleges
export async function GET(request) {
    try {
        await dbConnect();
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

// POST a new college
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newCollege = await College.create(body);
        return NextResponse.json({
            message: "College created successfully",
            success: true,
            data: newCollege,
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "Failed to create college",
            success: false,
            error: error.message,
        }, { status: 400 });
    }
}
