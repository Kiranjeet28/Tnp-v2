"use client"

import type { Post } from "@prisma/client"
import { useEffect, useState } from "react"
import PostsList from "./postList"
import { Footer } from "./Footer"
import { NavbarDemo } from "../reusable/navbar"
import { Statistics } from "./Analysis"
import SmartFilter from "./smartFilter"

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDepartment, setSelectedDepartment] = useState("")
    const [selectedTag, setSelectedTag] = useState("")
    const [minCGPA, setMinCGPA] = useState("")
    const [showExpiredOnly, setShowExpiredOnly] = useState(false)

    // Available filter options
    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [availableDepartments, setAvailableDepartments] = useState<string[]>([])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (searchTerm.trim() !== "") params.append("searchTerm", searchTerm)
            if (selectedDepartment && selectedDepartment !== "") params.append("department", selectedDepartment)
            if (selectedTag && selectedTag !== "") params.append("tag", selectedTag)
            if (minCGPA.trim() !== "") params.append("minCGPA", minCGPA)
            // Remove the showExpiredOnly from API call since we'll filter client-side
            // if (showExpiredOnly) params.append("showExpiredOnly", "true");

            const response = await fetch(`/api/posts?${params.toString()}`)
            if (!response.ok) throw new Error("Failed to fetch posts")

            const data = await response.json()

            const fetchedPosts: Post[] = data.posts.map((post: Post) => ({
                ...post,
                createdAt: new Date(post.createdAt),
                updatedAt: new Date(post.updatedAt),
                LastSubmittedAt: post.LastSubmittedAt ? new Date(post.LastSubmittedAt) : undefined,
            }))

            setPosts(fetchedPosts)
            setAvailableTags(data.tags || [])
            setAvailableDepartments(data.departments || [])
        } catch (error) {
            console.error("Error fetching posts:", error)
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch posts whenever filters change (excluding showExpiredOnly since it's client-side)
    useEffect(() => {
        fetchPosts()
    }, [searchTerm, selectedDepartment, selectedTag, minCGPA])

    // Initial load
    useEffect(() => {
        fetchPosts()
    }, [])

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedDepartment("")
        setSelectedTag("")
        setMinCGPA("")
        setShowExpiredOnly(false)
    }

    const now = new Date()

    // Filter posts based on expired status
    const getFilteredPosts = () => {
        if (showExpiredOnly) {
            // Show only expired posts (LastSubmittedAt < now)
            return posts.filter((post) => {
                // Return posts that either have LastSubmittedAt < now or do not have LastSubmittedAt
                return !post.LastSubmittedAt || new Date(post.LastSubmittedAt) < now
            })
        } else {
            return posts
        }
    }

    const filteredPosts = getFilteredPosts()

    // Calculate statistics
    const activeOpportunities = posts.filter((post) => {
        if (!post.LastSubmittedAt) return false // Posts without deadline are active
        return new Date(post.LastSubmittedAt) >= now
    }).length

    const expiredOpportunities = posts.filter((post) => {
        return !post.LastSubmittedAt || new Date(post.LastSubmittedAt) < now
    }).length

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <NavbarDemo />
            <Statistics activeOpportunities={activeOpportunities} expiredOpportunities={expiredOpportunities} />

            <div className="container mx-auto px-4 py-12">
                <SmartFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    minCGPA={minCGPA}
                    setMinCGPA={setMinCGPA}
                    showExpiredOnly={showExpiredOnly}
                    setShowExpiredOnly={setShowExpiredOnly}
                    availableTags={availableTags}
                    availableDepartments={availableDepartments}
                    clearFilters={clearFilters}
                />
                <PostsList posts={filteredPosts} loading={loading} activeOpportunities={activeOpportunities} />
            </div>

            <Footer />
        </div>
    )
}
