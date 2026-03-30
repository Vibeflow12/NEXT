import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({
                error: "you are not authenticate"
            }, { status: 401 })
        }
        return NextResponse.json(user)
    } catch (error) {
        console.error("ERROR", error);
        return NextResponse.json({
            error: "internal server error,something went wrong"
        }, { status: 500 })
    }
}