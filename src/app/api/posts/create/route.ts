import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Define schema with Zod
const postSchema = z.object({
    id: z.string().optional(), // Add optional id for updates
    title: z.string().min(1, "Title is required"),
    content: z.string().optional().default(""),
    excerpt: z.string().optional().nullable(),
    tags: z.array(z.string()).optional().default([]),
    department: z.string().optional().nullable(),
    CGPA: z
        .number()
        .nullable()
        .optional()
        .transform((val) => (val === 0 ? null : val)),
    LastSubmittedAt: z
        .string()
        .nullable()
        .optional()
        .transform((val) => (val ? new Date(val) : null)),
    isDraft: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Parse + validate input
        const parsed = postSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 })
        }

        const data = parsed.data

        // Business rule: content required if not draft
        if (!data.isDraft && !data.content.trim()) {
            return NextResponse.json({ error: "Content is required for published posts" }, { status: 400 })
        }

        // Save post
        const post = await prisma.post.create({
            data: {
                title: data.title.trim(),
                content: data.content,
                excerpt: data.excerpt?.trim() || null,
                tags: data.tags,
                department: data.department,
                CGPA: data.CGPA,
                LastSubmittedAt: data.LastSubmittedAt,
            },
        })

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                title: post.title,
                createdAt: post.createdAt,
            },
        })
    } catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()

        // Parse + validate input
        const parsed = postSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 })
        }

        const data = parsed.data

        // Ensure ID is provided for updates
        if (!data.id) {
            return NextResponse.json({ error: "Post ID is required for updates" }, { status: 400 })
        }

        // Business rule: content required if not draft
        if (!data.isDraft && !data.content.trim()) {
            return NextResponse.json({ error: "Content is required for published posts" }, { status: 400 })
        }

        // Check if post exists
        const existingPost = await prisma.post.findUnique({
            where: { id: data.id },
        })

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        // Update post
        const post = await prisma.post.update({
            where: { id: data.id },
            data: {
                title: data.title.trim(),
                content: data.content,
                excerpt: data.excerpt?.trim() || null,
                tags: data.tags,
                department: data.department,
                CGPA: data.CGPA,
                LastSubmittedAt: data.LastSubmittedAt,
            },
        })

        return NextResponse.json({
            success: true,
            post: {
                id: post.id,
                title: post.title,
                updatedAt: post.updatedAt,
            },
        })
    } catch (error) {
        console.error("Error updating post:", error)
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }
}
