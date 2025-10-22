"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TagInput } from "./tag-input"
import { CalendarIcon, Eye, Send } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import type { Post } from "@prisma/client"
import { LabelInputContainer } from "../reusable/LabelInput"
import { BackgroundGradient } from "../ui/background-gradient"
import dynamic from "next/dynamic"
import { PostCard } from "../main/postCard"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
    ssr: false,
})

type RichTextEditorHandle = {
    getContent: () => string
    setContent: (content: string) => void
}

interface PostCreationFormProps {
    initialPost?: Post | null
}

export function PostCreationForm({ initialPost }: PostCreationFormProps) {
    const route = useRouter()
    const [postData, setPostData] = useState<Post>(() => {
        if (initialPost) {
            return {
                ...initialPost,
                LastSubmittedAt: initialPost.LastSubmittedAt ? new Date(initialPost.LastSubmittedAt) : null,
            }
        }
        return {
            id: "",
            title: "",
            content: "",
            excerpt: "",
            tags: [],
            department: "",
            LastSubmittedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
    const editorRef = useRef<RichTextEditorHandle>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [previewData, setPreviewData] = useState<Post>(postData)
    const isEditMode = !!initialPost

    useEffect(() => {
        if (!isEditMode) {
            const savedContent = localStorage.getItem("editorContent")
            if (savedContent) {
                setPostData((prev) => ({ ...prev, content: savedContent }))
            }
        }
    }, [isEditMode])

    useEffect(() => {
        if (!isEditMode && postData.content) {
            localStorage.setItem("editorContent", postData.content)
        }
    }, [postData.content, isEditMode])

    const handleContentChange = (content: string) => {
        setPostData((prev) => ({ ...prev, content }))
    }

    const handleClear = () => {
        setPostData((prev) => ({ ...prev, content: "" }))
        localStorage.removeItem("editorContent")
        if (editorRef.current) {
            editorRef.current.setContent("")
        }
    }

    const handlePreviewOpen = () => {
        const latestContent = editorRef.current?.getContent() || postData.content
        setPreviewData({
            ...postData,
            content: latestContent,
        })
        setIsPreviewOpen(true)
    }

    const handleSubmit = async () => {
        setIsSaving(true)
        console.log("PostData before submit:", postData)

        try {
            const latestContent = editorRef.current?.getContent() || postData.content

            const submitData: any = {
                title: postData.title,
                content: latestContent,
                tags: postData.tags,
                excerpt: postData.excerpt?.trim() || null,
                department: postData.department ?? null,
                LastSubmittedAt: postData.LastSubmittedAt ? postData.LastSubmittedAt.toISOString() : null,
            }

            if (isEditMode) {
                submitData.id = postData.id
            }

            console.log("Submitting:", submitData)

            const response = await fetch("/api/posts/create", {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            })

            if (response.ok) {
                const result = await response.json()
                console.log("Post saved successfully:", result)
                if (!isEditMode) {
                    localStorage.removeItem("editorContent")
                }
                toast.success(isEditMode ? "Post updated successfully!" : "Post saved successfully!")
                route.push(isEditMode ? `/post/${postData.id}` : "/")
            } else {
                const error = await response.json()
                console.error("Failed to save post:", error.error)
                toast.error("Failed to save post: " + (error.error || "Unknown error"))
            }
        } catch (error) {
            console.error("Error saving post:", error)
            toast.error("Network error while saving post.")
        } finally {
            setIsSaving(false)
        }
    }

    const departments = [
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Electronics Engineering",
        "Information Technology",
    ]

    return (
        <div className="max-w-4xl mx-auto">
            <BackgroundGradient className="rounded-3xl">
                <div className="bg-white rounded-3xl p-8 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <LabelInputContainer>
                            <Label
                                htmlFor="title"
                                className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent"
                            >
                                Title *
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter post title..."
                                value={postData.title}
                                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                                className="text-lg font-semibold border-2"
                            />
                        </LabelInputContainer>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <LabelInputContainer>
                            <Label className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                                Content *
                            </Label>
                            <div>
                                <RichTextEditor
                                    ref={editorRef}
                                    onContentChange={handleContentChange}
                                    initialContent={postData.content}
                                    debounceMs={500} // Wait 500ms after user stops typing
                                />
                            </div>
                        </LabelInputContainer>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <LabelInputContainer>
                            <Label
                                htmlFor="excerpt"
                                className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent"
                            >
                                Excerpt
                            </Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Brief description of your post..."
                                value={postData.excerpt || ""}
                                onChange={(e) => setPostData({ ...postData, excerpt: e.target.value || null })}
                                rows={3}
                                className="border-2"
                            />
                        </LabelInputContainer>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <LabelInputContainer>
                            <Label className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                                Tags
                            </Label>
                            <TagInput
                                tags={postData.tags}
                                onChange={(tags) => setPostData({ ...postData, tags })}
                                placeholder="Add tags..."
                            />
                        </LabelInputContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <LabelInputContainer>
                                <Label className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                                    Department
                                </Label>
                                <Select
                                    value={postData.department || ""}
                                    onValueChange={(value) => setPostData({ ...postData, department: value || null })}
                                >
                                    <SelectTrigger className="border-2 border-blue-100 focus:border-blue-500">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-200">
                                        {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept} className="hover:bg-blue-50">
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </LabelInputContainer>
                        </div>

                       
                    </div>

                    {/* Deadline */}
                    <div className="space-y-2">
                        <LabelInputContainer>
                            <Label className="text-sm font-semibold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                                Submission Deadline
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal border-2 border-blue-100 hover:bg-blue-50 hover:border-blue-300 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 bg-clip-text text-transparent",
                                            !postData.LastSubmittedAt && "text-slate-500",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                                        {postData.LastSubmittedAt ? format(postData.LastSubmittedAt, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border-2 border-blue-200 shadow-xl rounded-md ">
                                    <Calendar
                                        mode="single"
                                        selected={postData.LastSubmittedAt ? postData.LastSubmittedAt : undefined}
                                        onSelect={(date) => setPostData({ ...postData, LastSubmittedAt: date || null })}
                                        autoFocus
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </PopoverContent>
                            </Popover>
                        </LabelInputContainer>
                    </div>
                </div>
            </BackgroundGradient>

            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handlePreviewOpen}
                            variant="outline"
                            className="flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                        >
                            <Eye className="h-5 w-5" />
                            Preview Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl overflow-y-auto bg-white border-2 border-blue-400 rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-slate-800 text-xl font-bold">Post Preview</DialogTitle>
                        </DialogHeader>
                        <PostCard post={previewData} />
                    </DialogContent>
                </Dialog>

                <Button
                    onClick={() => handleSubmit()}
                    disabled={isSaving || !postData.title.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900 shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                    <Send className="h-5 w-5" />
                    {isSaving ? (isEditMode ? "Updating..." : "Publishing...") : isEditMode ? "Update Post" : "Publish Post"}
                </Button>
            </div>
        </div>
    )
}
