"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto relative">
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for games, top-ups, gift cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-4 text-lg border-0 bg-white/95 backdrop-blur-sm shadow-lg rounded-full focus:ring-4 focus:ring-purple-300/50 focus:bg-white transition-all duration-300"
        />
      </div>
      <Button
        type="submit"
        className="ml-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Search
      </Button>
      <Button
        type="button"
        variant="outline"
        className="ml-2 px-4 py-4 bg-white/95 backdrop-blur-sm border-white/50 hover:bg-white rounded-full shadow-lg transition-all duration-300"
      >
        <Filter className="w-5 h-5" />
      </Button>
    </form>
  )
}
