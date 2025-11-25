"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Navigation from "@/components/Navigation"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"

interface MovieItem {
  id: string
  title: string
  thumbnail_url?: string
  thumbnail_file_path?: string
  description?: string
  rating?: number
  release_year?: number
  duration?: string
  status?: string
}

const MoviesPage = () => {
  const [allMovies, setAllMovies] = useState<MovieItem[]>([])
  const [filteredMovies, setFilteredMovies] = useState<MovieItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("movies")
        .select("id, title, thumbnail_url, thumbnail_file_path, description, rating, release_year, duration, status")
        .eq("is_archived", false)
        .order("title", { ascending: true })

      if (fetchError) {
        console.error("[v0] Supabase fetch error:", fetchError)
        setError(fetchError.message)
      } else if (data) {
        console.log("[v0] Fetched all movies:", data.length, "items")
        setAllMovies(data as MovieItem[])
        setFilteredMovies(data as MovieItem[])
      }
    } catch (err) {
      console.error("[v0] Fetch exception:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAllMovies()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setFilteredMovies(allMovies)
      return
    }

    const searchLower = query.toLowerCase()
    const filtered = allMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchLower) || movie.description?.toLowerCase().includes(searchLower),
    )

    setFilteredMovies(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies by title or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 py-2 bg-background/50 border border-muted-foreground/20"
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredMovies.length} of {allMovies.length} movies
          </div>

          {/* Error State */}
          {error && (
            <div className="py-4 px-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300 mb-6 flex justify-between items-center">
              <span>Error loading movies: {error}</span>
              <button
                onClick={() => fetchAllMovies()}
                className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading movies...</p>
            </div>
          )}

          {/* Movies Grid */}
          {!loading && filteredMovies.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredMovies.map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-muted mb-3 hover:scale-105 transition-transform duration-300">
                    <img
                      src={movie.thumbnail_url || "/placeholder.svg?height=300&width=200&query=movie"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center">
                        {movie.rating && <p className="text-yellow-400 font-semibold mb-2">⭐ {movie.rating}</p>}
                        {movie.duration && <p className="text-sm text-gray-300">{movie.duration}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    {movie.release_year && <p className="text-xs text-muted-foreground">{movie.release_year}</p>}
                    {movie.status && (
                      <p className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full w-fit capitalize">
                        {movie.status}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredMovies.length === 0 && (
            <div className="text-center py-12">
              {searchQuery ? (
                <>
                  <p className="text-muted-foreground text-lg mb-2">No movies found for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
                </>
              ) : (
                <p className="text-muted-foreground text-lg">No movies available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MoviesPage
