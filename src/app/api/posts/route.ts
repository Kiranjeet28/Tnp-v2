import { type NextRequest, NextResponse } from "next/server"
import { getPosts, getAllTags, getAllDepartments } from "@/lib/posts"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Extract filter parameters from query string
        const filters = {
            searchTerm: searchParams.get("searchTerm") || undefined,
            department: searchParams.get("department") || undefined,
            tag: searchParams.get("tag") || undefined,
            minCGPA: searchParams.get("minCGPA") ? Number.parseFloat(searchParams.get("minCGPA")!) : undefined,
        }

        // Remove undefined values and "All" selections
        Object.keys(filters).forEach((key) => {
            const value = filters[key as keyof typeof filters]
            if (value === undefined || value === "All" || value === "") {
                delete filters[key as keyof typeof filters]
            }
        })

        const posts = await getPosts(filters)
        const tags = await getAllTags()
        const departments = await getAllDepartments()

        return NextResponse.json({
            posts,
            tags: [, ...tags],
            departments: [, ...departments],
        })
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}
