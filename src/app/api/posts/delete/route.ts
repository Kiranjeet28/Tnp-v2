import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Define schema for delete request
const deleteSchema = z.object({
    id: z.string().min(1, "Post ID is required"),
})

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()

        // Parse and validate input
        const parsed = deleteSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 })
        }

        const { id } = parsed.data

        // Check if post exists
        const existingPost = await prisma.post.findUnique({
            where: { id },
        })

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        // Delete the post
        await prisma.post.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: "Post deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting post:", error)
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }
}
