"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"

interface Anime {
  id: string
  title: string
  description: string
  thumbnail_url?: string
}

interface SearchModalProps {
  onClose?: () => void
}

export const SearchModal = ({ onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setShowResults(true)
    const searchAnime = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("anime")
          .select("id, title, description, thumbnail_url")
          .ilike("title", `%${query}%`)
          .eq("is_archived", false)
          .limit(10)

        if (error) {
          console.error("[v0] Search error:", error)
          return
        }

        setResults(data || [])
      } catch (err) {
        console.error("[v0] Search exception:", err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchAnime, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="flex-1 max-w-md mx-4 relative">
      {/* Search input */}
      <div className="flex items-center gap-3 px-4 py-2 bg-foreground/10 rounded-lg border border-white">
        <Search className="h-4 w-4 text-foreground/60" />
        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/50"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery("")
              setShowResults(false)
            }}
            className="h-6 w-6 hover:bg-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:bg-foreground/20">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-lg shadow-lg border border-foreground/20 z-50">
          <div className="max-h-96 overflow-y-auto">
            {loading && <div className="p-4 text-center text-sm text-foreground/60">Searching...</div>}

            {!loading && results.length === 0 && query && (
              <div className="p-4 text-center text-sm text-foreground/60">No anime found</div>
            )}

            {!loading && results.length > 0 && (
              <div>
                {results.map((anime) => (
                  <button
                    key={anime.id}
                    onClick={() => {
                      navigate(`/anime/${anime.id}`)
                      setQuery("")
                      setShowResults(false)
                      onClose?.()
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors flex items-center gap-3 border-b border-foreground/10 last:border-b-0"
                  >
                    {anime.thumbnail_url && (
                      <img
                        src={anime.thumbnail_url || "/placeholder.svg"}
                        alt={anime.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm">{anime.title}</div>
                      <div className="text-xs text-foreground/60 line-clamp-1">{anime.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
