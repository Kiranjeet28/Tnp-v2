"use client"
import { useParams, useRouter } from "next/navigation"
import { PostCreationForm } from "@/components/create/post-creation-form"
import { usePost } from "@/lib/usePost"
import { useAuth } from "@/components/context/AuthContext";
export default function PostEditPage() {
    const { postid } = useParams<{ postid: string }>()
    const { post, loading, error } = usePost(postid)
    const { isAdmin, isAuthenticated } = useAuth();
    if (!isAdmin || !isAuthenticated) {
        const route = useRouter();
        route.push("/");
    }
    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
                <div className="container mx-auto flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading post...</p>
                    </div>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
                <div className="container mx-auto flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                        Edit Post
                    </h1>
                    <p className="text-blue-900 text-lg">Update your post details</p>
                </div>
                <PostCreationForm initialPost={post} />
            </div>
        </main>
    )
}