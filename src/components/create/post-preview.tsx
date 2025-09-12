"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, GraduationCap, Building2 } from "lucide-react"
import { format } from "date-fns"

interface PostData {
    title: string
    content: string
    excerpt: string
    tags: string[]
    department: string
    cgpa: number | null
    lastSubmittedAt: Date | null
}

interface PostPreviewProps {
    postData: PostData
}

export function PostPreview({ postData }: PostPreviewProps) {
    const renderContent = (content: string) => {
        // Simple markdown-like rendering
        return content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic">$1</blockquote>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
            .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
            .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
            .split("\n")
            .map((line) => (line.trim() ? `<p class="mb-2">${line}</p>` : "<br>"))
            .join("")
    }

    return (
        <Card className="max-w-none">
            <CardHeader className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground">{postData.title || "Untitled Post"}</h1>

                {postData.excerpt && <p className="text-muted-foreground text-lg leading-relaxed">{postData.excerpt}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {postData.department && (
                        <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {postData.department}
                        </div>
                    )}

                    {postData.cgpa && (
                        <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            Min CGPA: {postData.cgpa}
                        </div>
                    )}

                    {postData.lastSubmittedAt && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Deadline: {format(postData.lastSubmittedAt, "PPP")}
                        </div>
                    )}
                </div>

                {postData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {postData.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{
                        __html: renderContent(postData.content || "No content yet..."),
                    }}
                />
            </CardContent>
        </Card>
    )
}
