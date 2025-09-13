import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ postid: string }> }
) {
    try {
        const { postid } = await params

        if (!postid) {
            return NextResponse.json({ error: "Missing post id" }, { status: 400 })
        }

        const post = await prisma.post.findUnique({
            where: { id: postid },
        })

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}