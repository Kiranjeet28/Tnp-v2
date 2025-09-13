import { Post } from "@prisma/client"
import { useEffect, useState } from "react"

interface UsePostReturn {
    post: Post | null
    loading: boolean
    error: string | null
    refetch: () => void
}

export function usePost(postid: string | undefined): UsePostReturn {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPost = async () => {
        if (!postid) return

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/posts/${postid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(
                    errorData.error ||
                    (res.status === 404 ? "Post not found" : "Failed to fetch post")
                )
            }

            const data = await res.json()
            setPost(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            setPost(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [postid])

    return { post, loading, error, refetch: fetchPost }
}