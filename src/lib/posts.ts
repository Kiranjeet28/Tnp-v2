import { prisma } from "./prisma"

export interface PostFilters {
    searchTerm?: string
    department?: string
    tag?: string
    minCGPA?: number
}

export async function getPosts(filters: PostFilters = {}) {
    const { searchTerm, department, tag, minCGPA } = filters

    const where: any = {}

    // Search in title, content, and excerpt
    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            { excerpt: { contains: searchTerm, mode: "insensitive" } },
        ]
    }

    // Filter by department
    if (department && department !== "All") {
        where.department = department
    }

    // Filter by tag
    if (tag && tag !== "All") {
        where.tags = { has: tag }
    }

    // Filter by CGPA
    if (minCGPA) {
        where.OR = [
            { CGPA: null }, // Posts without CGPA requirement
            { CGPA: { lte: minCGPA } }, // Posts with CGPA <= user's CGPA
        ]
    }

    try {
        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: "desc" },
        })
        return posts
    } catch (error) {
        console.error("Error fetching posts:", error)
        return []
    }
}

export async function createPost(data: {
    title: string
    content: string
    excerpt?: string
    tags: string[]
    department?: string
    LastSubmittedAt?: Date
    CGPA?: number
}) {
    try {
        const post = await prisma.post.create({
            data,
        })
        return post
    } catch (error) {
        console.error("Error creating post:", error)
        throw error
    }
}

export async function getPostById(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
        })
        return post
    } catch (error) {
        console.error("Error fetching post:", error)
        return null
    }
}

export async function updatePost(
    id: string,
    data: Partial<{
        title: string
        content: string
        excerpt: string
        tags: string[]
        department: string
        LastSubmittedAt: Date
        CGPA: number
    }>,
) {
    try {
        const post = await prisma.post.update({
            where: { id },
            data,
        })
        return post
    } catch (error) {
        console.error("Error updating post:", error)
        throw error
    }
}

export async function deletePost(id: string) {
    try {
        await prisma.post.delete({
            where: { id },
        })
        return true
    } catch (error) {
        console.error("Error deleting post:", error)
        throw error
    }
}

// Get all unique tags from posts
export async function getAllTags() {
    try {
        const posts = await prisma.post.findMany({
            select: { tags: true },
        })

        const allTags = posts.flatMap((post) => post.tags)
        const uniqueTags = Array.from(new Set(allTags))

        return uniqueTags
    } catch (error) {
        console.error("Error fetching tags:", error)
        return []
    }
}

// Get all unique departments from posts
export async function getAllDepartments() {
    try {
        const posts = await prisma.post.findMany({
            select: { department: true },
            where: { department: { not: null } },
        })

        const departments = posts.map((post) => post.department).filter(Boolean)
        const uniqueDepartments = Array.from(new Set(departments))

        return uniqueDepartments
    } catch (error) {
        console.error("Error fetching departments:", error)
        return []
    }
}
