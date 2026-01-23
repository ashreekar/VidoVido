import { connectToDatabase } from "@/lib/db";
import { User } from "@/modals/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    error: "email and password required"
                },
                {
                    status: 400
                }
            )
        }

        await connectToDatabase();

        const userexists = await User.findOne({ email });

        if (userexists) {
            return NextResponse.json(
                {
                    error: "email exists try to login"
                },
                {
                    status: 400
                }
            )
        }

        await User.create({ email, password });

        return NextResponse.json(
            {
                message: "User created sucessfully"
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                error: "Internal server error at registration of user"
            },
            {
                status: 500
            }
        )
    }
}