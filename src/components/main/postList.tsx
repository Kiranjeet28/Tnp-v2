import type React from "react"
import { Loader2, Star, Search } from "lucide-react"
import { PostCard } from "./postCard"
import type { Post } from "@prisma/client"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"

interface PostsListProps {
    posts: Post[]
    loading: boolean
    activeOpportunities: number
}

const PostsList: React.FC<PostsListProps> = ({ posts, loading, activeOpportunities }) => {
    const { isAdmin } = useAuth()

    // Filter posts
    const getFilteredPosts = (): Post[] => {
        // Admin sees all posts
        if (isAdmin) return posts

        const today = new Date()
        // Non-admin users see only posts with deadline in future
        return posts.filter(post => {
            if (!post.LastSubmittedAt) return true
            const deadline = new Date(post.LastSubmittedAt)
            return deadline > today
        })
    }

    const filteredPosts = getFilteredPosts()

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                {loading ? (
                    <div className="flex items-center text-blue-600">
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        <span className="text-xl">Loading opportunities...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-6">
                        <p className="text-xl font-semibold text-blue-900">
                            Showing <span className="text-blue-600 font-bold">{filteredPosts.length}</span> opportunities
                            {isAdmin && (
                                <span className="ml-2 text-sm text-purple-600 font-medium">
                                    (Admin View - All Posts)
                                </span>
                            )}
                        </p>
                        {activeOpportunities > 0 && (
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium flex items-center animate-pulse">
                                <Star className="w-4 h-4 mr-2" />
                                {activeOpportunities} Still Open
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Posts */}
            <div className="space-y-6">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 text-center py-24">
                        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-500" />
                        <p className="text-2xl text-blue-900 mb-4">Loading amazing opportunities...</p>
                        <p className="text-blue-600">Please wait while we fetch the latest posts</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-blue-300 text-center py-24">
                        <div className="animate-bounce mb-6">
                            <Search className="w-20 h-20 mx-auto text-blue-400" />
                        </div>
                        <p className="text-2xl text-blue-900 mb-4">No opportunities found</p>
                        <p className="text-blue-600 mb-8">
                            {isAdmin
                                ? 'Try adjusting your filters to see more results.'
                                : 'All current opportunities have expired. Check back later for new ones!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post: Post) => (
                            <Link key={post.id} href={`/post/${post.id}`} passHref>
                                <PostCard post={post} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostsList
