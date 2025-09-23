import dbConnect from "@/lib/mongodb";
import Resource from "@/models/resources";
import { NextResponse } from "next/server";

// GET a single resource by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();
        const resource = await Resource.findById(params.id);
        if (!resource) {
            return NextResponse.json({ message: "Resource not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: resource });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// PUT (update) a resource by ID
export async function PUT(request, { params }) {
    // ⬇️ SECURITY CHECK REMOVED FOR NOW
    try {
        await dbConnect();
        const body = await request.json();

        // Remove immutable fields from the body before updating to prevent errors
        delete body._id;
        delete body.createdAt;
        delete body.updatedAt;
        delete body.__v;

        const updatedResource = await Resource.findByIdAndUpdate(params.id, body, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validation
        });

        if (!updatedResource) {
            return NextResponse.json({ message: "Resource not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Resource updated successfully", data: updatedResource });
    } catch (error) {
        console.error("Update Resource Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update resource.", error: error.message }, { status: 400 });
    }
}

// DELETE a resource by ID
export async function DELETE(request, { params }) {
    // ⬇️ SECURITY CHECK REMOVED FOR NOW
    try {
        await dbConnect();
        const deletedResource = await Resource.findByIdAndDelete(params.id);

        if (!deletedResource) {
            return NextResponse.json({ message: "Resource not found", success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Resource deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

