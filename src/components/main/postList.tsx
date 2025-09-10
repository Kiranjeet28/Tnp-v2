import type React from "react"
import { Loader2, Star, Search } from "lucide-react"
import { PostCard } from "./postCard"
import type { Post } from "@prisma/client"

interface PostsListProps {
    posts: Post[]
    loading: boolean
    activeOpportunities: number
}

const PostsList: React.FC<PostsListProps> = ({ posts, loading, activeOpportunities }) => {
    return (
        <div>
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
                {loading ? (
                    <div className="flex items-center text-blue-600">
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        <span className="text-xl">Loading opportunities...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-6">
                        <p className="text-xl font-semibold text-blue-900">
                            Showing <span className="text-blue-600 font-bold">{posts.length}</span> opportunities
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

            {/* Posts Grid */}
            <div className="space-y-6">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 text-center py-24">
                        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-500" />
                        <p className="text-2xl text-blue-900 mb-4">Loading amazing opportunities...</p>
                        <p className="text-blue-600">Please wait while we fetch the latest posts</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-blue-300 text-center py-24">
                        <div className="animate-bounce mb-6">
                            <Search className="w-20 h-20 mx-auto text-blue-400" />
                        </div>
                        <p className="text-2xl text-blue-900 mb-4">No opportunities found</p>
                        <p className="text-blue-600 mb-8">Try adjusting your filters to see more results</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post: Post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostsList
