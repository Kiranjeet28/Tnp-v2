import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PostCreationForm } from "@/components/create/post-creation-form"

interface PostEditPageProps {
    params: {
        postid: string
    }
}

async function getPost(id: string) {
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

export default async function PostEditPage({ params }: PostEditPageProps) {
    const post = await getPost(params.postid)

    if (!post) {
        notFound()
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
