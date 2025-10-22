"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, X, Sparkles, Clock, ChevronDown, AlertCircle, Filter, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { LabelInputContainer } from "../reusable/LabelInput"

interface SmartFilterProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedDepartment: string
    setSelectedDepartment: (value: string) => void
    selectedTag: string
    setSelectedTag: (value: string) => void
    showExpiredOnly: boolean
    setShowExpiredOnly: (value: boolean) => void
    availableDepartments: string[]
    availableTags: string[]
    clearFilters: () => void
}

const SmartFilter: React.FC<SmartFilterProps> = ({
    searchTerm = "",
    setSearchTerm = () => { },
    selectedDepartment = "",
    setSelectedDepartment = () => { },
    selectedTag = "",
    setSelectedTag = () => { },
    showExpiredOnly = false,
    setShowExpiredOnly = () => { },
    availableDepartments = ["Computer Science", "Engineering", "Business", "Design", "Data Science"],
    availableTags = ["Remote", "Full-time", "Internship", "Contract", "Part-time"],
    clearFilters = () => { },
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [activeFilters, setActiveFilters] = useState(0)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Count active filters
        let count = 0
        if (searchTerm) count++
        if (selectedDepartment) count++
        if (selectedTag) count++
        if (showExpiredOnly) count++
        setActiveFilters(count)
    }, [searchTerm, selectedDepartment, selectedTag,  showExpiredOnly])

    const handleClearFilters = () => {
        setSearchTerm("")
        setSelectedDepartment("")
        setSelectedTag("")
        setShowExpiredOnly(false)
        clearFilters()
    }

    const handleExpiredToggle = () => {
        setShowExpiredOnly(!showExpiredOnly)
    }

    return (
        <div
            className={`relative mb-16 transform transition-all duration-1000 ease-out ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
                }`}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tl from-blue-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50/30 to-white/30 rounded-full blur-3xl"></div>
            </div>

            {/* Main container with enhanced design */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100 overflow-hidden group hover:shadow-3xl transition-all duration-500">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <Filter className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Smart Filter</h2>
                                <p className="text-blue-100 text-sm">Find your perfect opportunity</p>
                            </div>
                        </div>
                        {activeFilters > 0 && (
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-yellow-300" />
                                <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                                    {activeFilters} active
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8 space-y-8">
                    {/* Enhanced Search Section */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-[1.02]' : ''}`}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative">
                                    <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-all duration-300 ${isSearchFocused ? 'text-blue-600 scale-110' : 'text-blue-400'}`} />
                                    <Input
                                        type="text"
                                        placeholder="Search for opportunities, companies, roles, or keywords..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className="w-full pl-16 pr-6 py-5 border-2 border-blue-100 rounded-xl focus:border-blue-600 focus:outline-none transition-all duration-300 text-blue-900 text-lg placeholder-blue-400 bg-white shadow-lg hover:shadow-xl focus:shadow-2xl"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-blue-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {/* Department Filter */}
                        <LabelInputContainer>
                            <Label className="flex items-center text-sm font-bold text-blue-900 tracking-wide">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mr-3"></div>
                                DEPARTMENT
                            </Label>
                            <div className="relative group">
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border-2 border-blue-100 rounded-xl focus:border-blue-600 focus:outline-none transition-all duration-300 text-blue-900 font-medium appearance-none cursor-pointer shadow-md hover:shadow-lg focus:shadow-xl group-hover:border-blue-300 h-10"
                                >
                                    <option value="">All Departments</option>
                                    {availableDepartments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-800/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </LabelInputContainer>

               
                        
                        {/* Status Toggle */}
                        <LabelInputContainer className="justify-end">
                            <Label className="flex items-center text-sm font-bold text-blue-900 tracking-wide">
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mr-3"></div>
                                STATUS
                            </Label>
                            <div className="relative group">
                                <button
                                    onClick={handleExpiredToggle}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left font-medium shadow-md hover:shadow-lg ${showExpiredOnly
                                        ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-900"
                                        : "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-900"
                                        }`}
                                >
                                    <div className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            {showExpiredOnly ? (
                                                <AlertCircle className="w-5 h-5 text-red-600" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-green-600" />
                                            )}
                                            <span className="font-semibold">
                                                {showExpiredOnly ? "Expired Only" : "All Jobs"}
                                            </span>
                                        </div>
                                        <div
                                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${showExpiredOnly ? "bg-red-500" : "bg-green-500"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${showExpiredOnly ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </LabelInputContainer>
                    </div>

                    {/* Active Filters Display */}
                    {activeFilters > 0 && (
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-20"></div>
                            <div className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className="font-bold text-blue-900 text-lg">Active Filters</h4>
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Clear All</span>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {searchTerm && (
                                        <div className="group">
                                            <div className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full font-semibold border-2 border-blue-700 flex items-center space-x-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                                <Search className="w-4 h-4" />
                                                <span>"{searchTerm}"</span>
                                            </div>
                                        </div>
                                    )}
                                    {selectedDepartment && (
                                        <div className="group">
                                            <div className="px-5 py-3 bg-white text-blue-900 rounded-full font-semibold border-2 border-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                                🎓 {selectedDepartment}
                                            </div>
                                        </div>
                                    )}
                                    {selectedTag && (
                                        <div className="group">
                                            <div className="px-5 py-3 bg-white text-blue-900 rounded-full font-semibold border-2 border-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                                🏷️ {selectedTag}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {showExpiredOnly && (
                                        <div className="group">
                                            <div className="px-5 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-900 rounded-full font-semibold border-2 border-red-400 flex items-center space-x-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Expired Jobs</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-600 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
            </div>

            {/* Enhanced bottom shadow */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent rounded-full blur-2xl"></div>
        </div>
    )
}

export default SmartFilter

