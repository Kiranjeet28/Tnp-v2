"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
}

export function TagInput({ tags, onChange, placeholder = "Add tags..." }: TagInputProps) {
    const [inputValue, setInputValue] = useState("")

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const newTag = inputValue.trim()
            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag])
                setInputValue("")
            }
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1))
        }
    }

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((tag) => tag !== tagToRemove))
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
                    >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-600">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="border-2 border-blue-100 focus:ring-blue-500/20 "
            />
        </div>
    )
}
