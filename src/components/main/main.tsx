"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MagicCard } from "../magicui/magic-card" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Calendar,
    Clock,
    GraduationCap,
    Building2,
    Search,
    Filter,
    Plus,
    Loader2,
    TrendingUp,
    Users,
    Award,
    ChevronRight,
    Star,
    Briefcase,
} from "lucide-react"
import { format } from "date-fns"

interface Post {
    id: string
    title: string
    content: string
    excerpt?: string
    tags: string[]
    department?: string
    LastSubmittedAt?: Date
    createdAt: Date
    updatedAt: Date
    CGPA?: number
}

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDepartment, setSelectedDepartment] = useState("All")
    const [selectedTag, setSelectedTag] = useState("All")
    const [minCGPA, setMinCGPA] = useState("")
    const [availableTags, setAvailableTags] = useState<string[]>(["All"])
    const [availableDepartments, setAvailableDepartments] = useState<string[]>(["All"])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (searchTerm && searchTerm !== "") params.append("searchTerm", searchTerm)
            if (selectedDepartment && selectedDepartment !== "All") params.append("department", selectedDepartment)
            if (selectedTag && selectedTag !== "All") params.append("tag", selectedTag)
            if (minCGPA && minCGPA !== "") params.append("minCGPA", minCGPA)

            const response = await fetch(`/api/posts?${params.toString()}`)
            if (!response.ok) throw new Error("Failed to fetch posts")

            const data = await response.json()
            setPosts(
                data.posts.map((post: any) => ({
                    ...post,
                    createdAt: new Date(post.createdAt),
                    updatedAt: new Date(post.updatedAt),
                    LastSubmittedAt: post.LastSubmittedAt ? new Date(post.LastSubmittedAt) : undefined,
                })),
            )
            setAvailableTags(data.tags)
            setAvailableDepartments(data.departments)
        } catch (error) {
            console.error("Error fetching posts:", error)
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [searchTerm, selectedDepartment, selectedTag, minCGPA])

    useEffect(() => {
        fetchPosts()
    }, [])

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedDepartment("All")
        setSelectedTag("All")
        setMinCGPA("")
    }

    const isPostNotDue = (post: Post) => {
        if (!post.LastSubmittedAt) return false
        return new Date(post.LastSubmittedAt) > new Date()
    }

    const activeOpportunities = posts.filter(isPostNotDue).length
    const totalPosts = posts.length

    return (
        <div className="min-h-screen bg-background">
            <header className="hero-gradient text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <nav className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-8">
                            <div className="text-2xl font-bold">GNDEC</div>
                            <div className="hidden md:flex space-x-6">
                                <a href="#opportunities" className="hover:text-accent transition-colors">
                                    Opportunities
                                </a>
                                <a href="#announcements" className="hover:text-accent transition-colors">
                                    Announcements
                                </a>
                                <a href="#resources" className="hover:text-accent transition-colors">
                                    Resources
                                </a>
                                <a href="#contact" className="hover:text-accent transition-colors">
                                    Contact
                                </a>
                            </div>
                        </div>
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground pulse-glow">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Post
                        </Button>
                    </nav>

                    <div className="text-center py-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">Training & Placement Portal</h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                            Guru Nanak Dev Engineering College - Your Gateway to Career Excellence
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3">
                                Explore Opportunities
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3 bg-transparent"
                            >
                                View Resources
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-12 bg-card">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center border-accent/20 hover:border-accent transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center mb-2">
                                    <Briefcase className="w-8 h-8 text-accent" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeOpportunities}</div>
                                <div className="text-sm text-muted-foreground">Active Opportunities</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-secondary/20 hover:border-secondary transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center mb-2">
                                    <TrendingUp className="w-8 h-8 text-secondary" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">95%</div>
                                <div className="text-sm text-muted-foreground">Placement Rate</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-accent/20 hover:border-accent transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center mb-2">
                                    <Users className="w-8 h-8 text-accent" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                                <div className="text-sm text-muted-foreground">Students Placed</div>
                            </CardContent>
                        </Card>
                        <Card className="text-center border-secondary/20 hover:border-secondary transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-center mb-2">
                                    <Award className="w-8 h-8 text-secondary" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">150+</div>
                                <div className="text-sm text-muted-foreground">Partner Companies</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <Card className="mb-8 border-accent/20 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
                        <CardTitle className="flex items-center text-primary text-xl">
                            <Filter className="w-6 h-6 mr-3 text-accent" />
                            Smart Filters
                            <Badge className="ml-3 bg-accent text-accent-foreground">Advanced</Badge>
                        </CardTitle>
                        <CardDescription>Find the perfect opportunities tailored to your profile</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-accent" />
                                <Input
                                    placeholder="Search opportunities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-accent/30 focus:border-accent"
                                />
                            </div>

                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger className="border-accent/30 focus:border-accent">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDepartments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedTag} onValueChange={setSelectedTag}>
                                <SelectTrigger className="border-accent/30 focus:border-accent">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTags.map((tag) => (
                                        <SelectItem key={tag} value={tag}>
                                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Min CGPA"
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                value={minCGPA}
                                onChange={(e) => setMinCGPA(e.target.value)}
                                className="border-accent/30 focus:border-accent"
                            />

                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                            >
                                Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-6 flex items-center justify-between">
                    {loading ? (
                        <div className="flex items-center text-muted-foreground">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin text-accent" />
                            <span className="text-lg">Loading opportunities...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <p className="text-lg font-medium text-primary">
                                Showing <span className="text-accent font-bold">{posts.length}</span> opportunities
                            </p>
                            {activeOpportunities > 0 && (
                                <Badge className="bg-secondary text-secondary-foreground animate-pulse">
                                    <Star className="w-3 h-3 mr-1" />
                                    {activeOpportunities} Still Open
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Posts Grid */}
                <div className="grid gap-6">
                    {loading ? (
                        <Card className="text-center py-16 border-accent/20">
                            <CardContent>
                                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-accent" />
                                <p className="text-xl text-muted-foreground">Loading amazing opportunities...</p>
                                <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch the latest posts</p>
                            </CardContent>
                        </Card>
                    ) : posts.length === 0 ? (
                        <Card className="text-center py-16 border-dashed border-2 border-accent/30">
                            <CardContent>
                                <div className="float-animation mb-6">
                                    <Search className="w-16 h-16 mx-auto text-accent/50" />
                                </div>
                                <p className="text-xl text-muted-foreground mb-4">No opportunities found</p>
                                <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
                                <Button onClick={clearFilters} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                    Clear All Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        posts.map((post) => {
                            const PostWrapper = isPostNotDue(post) ? MagicCard : Card
                            const wrapperProps = isPostNotDue(post)
                                ? {
                                    className:
                                        "hover:shadow-2xl transition-all duration-300 border-accent/30 bg-gradient-to-br from-accent/5 to-secondary/5 transform hover:-translate-y-1",
                                    gradientColor: "#00bcd4",
                                    gradientOpacity: 0.15,
                                }
                                : {
                                    className:
                                        "hover:shadow-xl transition-all duration-300 border-accent/20 transform hover:-translate-y-1",
                                }

                            return (
                                <PostWrapper key={post.id} {...wrapperProps}>
                                    {isPostNotDue(post) && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <Badge className="bg-secondary text-secondary-foreground animate-pulse shadow-lg">
                                                <Star className="w-3 h-3 mr-1" />
                                                Still Open
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl text-primary hover:text-accent cursor-pointer transition-colors mb-2">
                                                    {post.title}
                                                </CardTitle>
                                                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                                                    {post.excerpt}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {post.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-foreground mb-6 line-clamp-3 leading-relaxed">{post.content}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                                            {post.department && (
                                                <div className="flex items-center text-muted-foreground">
                                                    <Building2 className="w-4 h-4 mr-2 text-accent" />
                                                    <span>{post.department}</span>
                                                </div>
                                            )}

                                            {post.CGPA && (
                                                <div className="flex items-center text-muted-foreground">
                                                    <GraduationCap className="w-4 h-4 mr-2 text-accent" />
                                                    <span>Min CGPA: {post.CGPA}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="w-4 h-4 mr-2 text-accent" />
                                                <span>{format(post.createdAt, "MMM dd, yyyy")}</span>
                                            </div>

                                            {post.LastSubmittedAt && (
                                                <div className="flex items-center">
                                                    <Calendar
                                                        className={`w-4 h-4 mr-2 ${isPostNotDue(post) ? "text-secondary" : "text-destructive"}`}
                                                    />
                                                    <span className={`font-medium ${isPostNotDue(post) ? "text-secondary" : "text-destructive"}`}>
                                                        Due: {format(post.LastSubmittedAt, "MMM dd, yyyy")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-border">
                                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                                                View Details
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </PostWrapper>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
