import dbConnect from "@/lib/mongodb";
import Resource from "@/models/resources";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// GET all resources
export async function GET(request) {
    try {
        await dbConnect();
        const resources = await Resource.find({}).sort({ category: 1, subCategory: 1, title: 1 });
        return NextResponse.json({
            message: "Resources fetched successfully",
            success: true,
            data: resources,
        });
    } catch (error) {
        return NextResponse.json({
            message: "Failed to fetch resources",
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

// POST a new resource
export async function POST(request) {
    // ⬇️ SECURITY CHECK REMOVED FOR NOW
    // try {
    //     const { sessionClaims } = getAuth(request);
    //     if (sessionClaims?.metadata?.role !== "admin") {
    //         return NextResponse.json({ message: "Unauthorized: Access Denied" }, { status: 403 });
    //     }
    // ...
    // } catch ...
    
    try {
        await dbConnect();
        const body = await request.json();
        const newResource = await Resource.create(body);
        return NextResponse.json({
            message: "Resource created successfully",
            success: true,
            data: newResource,
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "Failed to create resource",
            success: false,
            error: error.message,
        }, { status: 400 });
    }
}

