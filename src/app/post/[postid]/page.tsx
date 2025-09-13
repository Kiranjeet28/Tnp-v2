"use client"
import { useParams } from "next/navigation"
import { PostDetailsView } from "@/components/post/post-details-view"
import { usePost } from "@/lib/usePost"

export default function PostPage() {
    const { postid } = useParams<{ postid: string }>()
    const { post, loading, error } = usePost(postid)

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading post...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {post && <PostDetailsView post={post} />}
            </div>
        </div>
    )
}