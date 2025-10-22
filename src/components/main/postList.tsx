import type React from "react"
import { Loader2, Star, Search } from "lucide-react"
import { PostCard } from "./postCard"
import type { Post } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"

interface PostsListProps {
    posts: Post[]
    loading: boolean
    activeOpportunities: number
}

interface User {
    id: string
    email: string
    name: string | null
    role: string
}

const PostsList: React.FC<PostsListProps> = ({ posts, loading, activeOpportunities }) => {
    const [user, setUser] = useState<User | null>(null)
    const [checkingAuth, setCheckingAuth] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            setCheckingAuth(false)
            return
        }

        try {
            const response = await fetch('/api/auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            }
        } catch (err) {
            console.error('Auth check failed:', err)
        } finally {
            setCheckingAuth(false)
        }
    }

    // Filter posts based on user role
    const getFilteredPosts = (): Post[] => {
        const now = new Date()

        // If ADMIN, show all posts
        if (user?.role === 'ADMIN') {
            return posts
        }

        // If USER or not logged in, show only posts where LastSubmittedAt is in the future or null
        return posts.filter(post => {
            if (!post.LastSubmittedAt) {
                return true // Show posts without deadline
            }
            const deadline = new Date(post.LastSubmittedAt)
            return deadline > now // Show only if deadline hasn't passed
        })
    }

    const filteredPosts = getFilteredPosts()
    const isLoading = loading || checkingAuth

    return (
        <div>
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
                {isLoading ? (
                    <div className="flex items-center text-blue-600">
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        <span className="text-xl">Loading opportunities...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-6">
                        <p className="text-xl font-semibold text-blue-900">
                            Showing <span className="text-blue-600 font-bold">{filteredPosts.length}</span> opportunities
                            {user?.role === 'ADMIN' && (
                                <span className="ml-2 text-sm text-purple-600 font-medium">(Admin View - All Posts)</span>
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

            {/* Posts Grid */}
            <div className="space-y-6">
                {isLoading ? (
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
                            {user?.role === 'ADMIN'
                                ? 'Try adjusting your filters to see more results'
                                : 'All current opportunities have expired. Check back later for new opportunities!'}
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