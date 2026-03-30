import { NextResponse } from "next/server"

export async function POST() {
    try {
        const response = NextResponse.json({
            message: "User logout"
        }, { status: 200 }
        );
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0
        });
        return response;
    } catch (error) {
        console.error("ERROR", error)
        return NextResponse.json(
            { error: "Failed to logout" },
            { status: 500 }
        );
    }
};