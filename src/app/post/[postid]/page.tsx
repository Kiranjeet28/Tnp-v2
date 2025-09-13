import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PostDetailsView } from "@/components/post/post-details-view"

interface PostPageProps {
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

export default async function PostPage({ params }: PostPageProps) {
    const post = await getPost(params.postid)

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <PostDetailsView post={post} />
            </div>
        </div>
    )
}
