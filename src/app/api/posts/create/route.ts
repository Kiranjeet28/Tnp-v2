import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // Adjust import path as needed

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            title,
            content,
            excerpt,
            tags,
            department,
            cgpa,
            lastSubmittedAt,
            isDraft
        } = body

        // Validate required fields
        if (!title?.trim()) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            )
        }

        if (!isDraft && !content?.trim()) {
            return NextResponse.json(
                { error: "Content is required for published posts" },
                { status: 400 }
            )
        }

        // Create the post
        const post = await prisma.post.create({
            data: {
                title: title.trim(),
                content: content || "",
                excerpt: excerpt?.trim() || null,
                tags: tags || [],
                department: department || null,
                CGPA: cgpa || null,
                LastSubmittedAt: lastSubmittedAt ? new Date(lastSubmittedAt) : null,
                // You might want to add an isDraft field to your schema
                // isDraft: isDraft || false
            }
        })

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                title: post.title,
                createdAt: post.createdAt
            }
        })

    } catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        )
    }
}