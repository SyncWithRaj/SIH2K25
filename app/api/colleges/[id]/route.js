import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import { NextResponse } from "next/server";

// GET a single college by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const college = await College.findById(params.id);
        if (!college) {
            return NextResponse.json({ message: "College not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: college });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// PUT (update) a college by ID
export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const body = await request.json();

        // ✅ THE FIX: Remove all immutable and Mongoose-managed fields
        // from the request body before attempting the update operation.
        delete body._id;
        delete body.createdAt;
        delete body.updatedAt;
        delete body.__v; // Also remove the version key

        const updatedCollege = await College.findByIdAndUpdate(params.id, body, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validation
        });

        if (!updatedCollege) {
            return NextResponse.json({ message: "College not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "College updated successfully", data: updatedCollege });
    } catch (error) {
        // Log the full error for better debugging on the server
        console.error("Update College Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update college.", error: error.message }, { status: 400 });
    }
}

// DELETE a college by ID
export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const deletedCollege = await College.findByIdAndDelete(params.id);

        if (!deletedCollege) {
            return NextResponse.json({ message: "College not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "College deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}


