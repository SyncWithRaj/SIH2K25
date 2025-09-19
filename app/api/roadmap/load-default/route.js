import Roadmap from '@/models/Roadmap';
import connectMongo from "@/lib/mongodb";
import { NextResponse } from 'next/server';

const DEFAULT_ROADMAP_ID = "68ca6db94d08565c057f6352";

export async function GET() {
    try {
        await connectMongo();

        const roadmap = await Roadmap.findById(DEFAULT_ROADMAP_ID);

        if (!roadmap) {
            return NextResponse.json({
                success: false,
                message: 'Default roadmap not found in the database.'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: roadmap,
            message: 'Default roadmap loaded successfully!',
        }, { status: 200 });

    } catch (error) {
        console.error('Failed to load default roadmap:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to load default roadmap.',
            error: error.message,
        }, { status: 500 });
    }
}
