"use client"

import type { Post } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Building2, GraduationCap, Clock, Calendar, Edit, Trash2, ArrowLeft, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PostDetailsViewProps {
    post: Post
}

export function PostDetailsView({ post }: PostDetailsViewProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const isPostNotDue = (post: Post) => {
        if (!post.LastSubmittedAt) return false
        return new Date(post.LastSubmittedAt) > new Date()
    }

    const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date))
    }

    const getDaysRemaining = (deadline: string | Date) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const handleEdit = () => {
        router.push(`/post/${post.id}/edit`)
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch("/api/posts/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: post.id }),
            })

            if (response.ok) {
                toast.success("Post deleted successfully!")
                router.push("/")
            } else {
                const error = await response.json()
                toast.error("Failed to delete post: " + (error.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Error deleting post:", error)
            toast.error("Network error while deleting post")
        } finally {
            setIsDeleting(false)
        }
    }

    const stillOpen = isPostNotDue(post)
    const daysRemaining = post.LastSubmittedAt ? getDaysRemaining(post.LastSubmittedAt) : null
    const isExpired = post.LastSubmittedAt

    return (
        <div className="space-y-6">
            {/* Header with Back Button and Actions */}
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2  bg-gradient-to-r hover:from-blue-900 hover:via-blue-800 hover:to-blue-900 hover:text-white font-bold transition duration-200 from-gray-200 to-white via-gray-200 text-blue-500 border-2  border-blue-500 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                <div className="flex items-center gap-3">
                    <Button onClick={handleEdit} className="flex items-center gap-2  bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white font-bold transition duration-200 hover:from-gray-200 hover:to-white hover:via-gray-200 hover:text-blue-500 border-2 border-transparent hover:border-blue-500 cursor-pointer">
                        <Edit className="w-4 h-4 cursor-pointer" />
                        Edit Post
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white font-bold transition duration-200 hover:from-gray-200 hover:to-white hover:via-gray-200 hover:text-red-600 border-2 border-transparent hover:border-red-600 cursor-pointer"
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500 cursor-pointer" />
                                    Delete Post
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 cursor-pointer">
                                    Delete Post
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>


            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                {/* Status Banner */}
                {stillOpen && (
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-4">
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 fill-white" />
                            <span className="font-semibold">
                                {daysRemaining && daysRemaining > 0
                                    ? `${daysRemaining} days remaining`
                                    : "Still accepting submissions"}
                            </span>
                        </div>
                    </div>
                )}

                {!isExpired && (
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">This opportunity has expired</span>
                        </div>
                    </div>
                )}

                {/* Post Header */}
                <div className="p-8 pb-6">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">{post.title}</h1>

                    {post.excerpt && (
                        <p
                            className="text-xl text-slate-600 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="px-8 pb-8">
                    <div
                        className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Post Metadata */}
                <div className="px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Department */}
                        {post.department && (
                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                                <div className="flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Department</p>
                                    <p className="text-lg font-semibold text-slate-800">{post.department}</p>
                                </div>
                            </div>
                        )}

                       

                        {/* Posted Date */}
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                            <div className="flex-shrink-0">
                                <Clock className="w-6 h-6 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Posted</p>
                                <p className="text-lg font-semibold text-slate-800">{formatDate(post.createdAt)}</p>
                            </div>
                        </div>

                        {/* Deadline */}
                        {post.LastSubmittedAt && (
                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50">
                                <div className="flex-shrink-0">
                                    <Calendar className={`w-6 h-6 ${stillOpen ? "text-emerald-500" : "text-red-500"}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">Deadline</p>
                                    <p className={`text-lg font-semibold ${stillOpen ? "text-emerald-700" : "text-red-700"}`}>
                                        {formatDate(post.LastSubmittedAt)}
                                    </p>
                                </div>
                            </div>
                        )}

                    

                    </div>
                </div>
            </div>
        </div>
    )
}
