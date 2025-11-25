"use client"

import { useState, useEffect } from "react"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

interface HeroItem {
  id: string
  title: string
  description?: string
  synopsis?: string
  thumbnail_url?: string
  thumbnail_file_path?: string
  thumbnail_file_name?: string
  rating?: number
  release_year?: number
  status?: string
  type: "anime" | "movie"
}

const HeroSection = () => {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroItems = async () => {
      try {
        const { data: animeData, error: animeError } = await supabase
          .from("anime")
          .select(
            "id, title, description, synopsis, thumbnail_url, thumbnail_file_path, thumbnail_file_name, rating, release_year, status",
          )
          .eq("is_archived", false)
          .order("rating", { ascending: false })
          .limit(3)

        const { data: moviesData, error: moviesError } = await supabase
          .from("movies")
          .select(
            "id, title, description, synopsis, thumbnail_url, thumbnail_file_path, thumbnail_file_name, rating, release_year, status",
          )
          .eq("is_archived", false)
          .order("rating", { ascending: false })
          .limit(3)

        if (!animeError && animeData) {
          const animeWithType = animeData.map((item) => ({
            ...item,
            type: "anime" as const,
          }))

          const moviesWithType =
            !moviesError && moviesData
              ? moviesData.map((item) => ({
                  ...item,
                  type: "movie" as const,
                }))
              : []

          const combined = [...animeWithType, ...moviesWithType]
          setHeroItems(combined as HeroItem[])
        }
      } catch (err) {
        console.error("[v0] Error fetching hero items:", err)
        setHeroItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchHeroItems()
  }, [])

  useEffect(() => {
    if (heroItems.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [heroItems])

  if (loading || heroItems.length === 0) {
    return (
      <div className="relative h-[50vh] md:h-[85vh] w-full overflow-hidden bg-gradient-to-b from-background/50 to-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading featured content...</p>
      </div>
    )
  }

  const current = heroItems[currentIndex]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length)
  }

  return (
    <div className="relative h-[50vh] md:h-[85vh] w-full overflow-hidden">
      {heroItems.map((item, index) => (
        <div
          key={`${item.type}-${item.id}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.thumbnail_url || "/placeholder.svg"})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          </div>
        </div>
      ))}

      <div className="relative h-full flex items-end pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-2xl space-y-4 md:space-y-6 animate-fade-in">
          <h1 className="text-xl md:text-3xl font-bold leading-tight">{current.title}</h1>

          <div className="flex items-center gap-3 text-sm md:text-base">
            <span className="px-2 py-1 bg-primary/20 border border-primary rounded text-xs font-semibold uppercase">
              {current.type === "movie" ? "Movie" : "Anime"}
            </span>
            {current.rating && <span className="text-primary font-semibold">{current.rating}% match</span>}
            <span className="px-2 py-0.5 border border-muted-foreground/50 text-xs">HD</span>
          </div>

          <p className="text-xs md:text-sm text-foreground/90 line-clamp-3 md:line-clamp-none">
            {current.description || current.synopsis || "Amazing content"}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={current.type === "movie" ? `/movie/${current.id}` : `/anime/${current.id}`}>
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 text-sm md:text-base px-4 md:px-8"
                onClick={() => {
                  console.log(
                    "[v0] Navigating to:",
                    current.type === "movie" ? `/movie/${current.id}` : `/anime/${current.id}`,
                    "ID:",
                    current.id,
                    "Type:",
                    current.type,
                  )
                }}
              >
                <Play className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                Watch
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-background/20 backdrop-blur-sm border-foreground/20 hover:bg-background/30 text-sm md:text-base px-4 md:px-6"
            >
              <Info className="h-4 w-4 md:h-5 md:w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-1 bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection

