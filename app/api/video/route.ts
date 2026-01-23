import { connectToDatabase } from "@/lib/db";
import { IVideo, Video } from "@/modals/video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await connectToDatabase()
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos);

    } catch (error) {
        console.log(error)
        return NextResponse.json([], { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorised" },
                { status: 401 }
            )
        }

        await connectToDatabase();

        const body: IVideo = await req.json()

        if (!body.title || !body.description || !body.videourl || !body.thumbnailurl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const videodata: IVideo = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videodata);

        return NextResponse.json(newVideo);
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}