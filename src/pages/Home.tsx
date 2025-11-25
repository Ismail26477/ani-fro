"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import AnimeRow from "@/components/AnimeRow"
import ContinueWatching from "@/components/ContinueWatching"
import GenreFilter from "@/components/GenreFilter"
import { supabase } from "@/integrations/supabase/client"

interface Anime {
  id: string
  title: string
  image: string
  release_year?: number
  rating?: number
  genres?: string[]
}

interface Movie {
  id: string
  title: string
  image: string
  release_year?: number
  rating?: number
  genres?: string[]
}

const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [allAnime, setAllAnime] = useState<Anime[]>([])
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnime = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: animeData, error: animeError } = await supabase
        .from("anime")
        .select(
          "id, title, thumbnail_url, thumbnail_file_path, thumbnail_file_name, release_year, rating, status, description, synopsis, episode_count, studio_name, created_at, updated_at",
        )
        .eq("is_archived", false)
        .order("rating", { ascending: false })
        .limit(100)

      if (animeError) {
        console.error("[v0] Anime fetch error:", animeError)
        setError(animeError.message)
        setLoading(false)
        return
      }

      if (!animeData) {
        setAllAnime([])
        setLoading(false)
        return
      }

      const animeWithGenres = await Promise.all(
        animeData.map(async (anime: any) => {
          const { data: genreData } = await supabase
            .from("anime_genres")
            .select("genres(name)")
            .eq("anime_id", anime.id)

          const genres = genreData?.map((g: any) => g.genres?.name).filter(Boolean) || []

          return {
            ...anime,
            image: anime.thumbnail_url || "/placeholder.svg",
            genres,
          }
        }),
      )

      console.log("[v0] Fetched anime data:", animeWithGenres.length, "items")
      setAllAnime(animeWithGenres as Anime[])
    } catch (err) {
      console.error("[v0] Fetch exception:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }

    setLoading(false)
  }

  const fetchMovies = async () => {
    try {
      const { data: moviesData, error: moviesError } = await supabase
        .from("movies")
        .select(
          "id, title, thumbnail_url, thumbnail_file_path, thumbnail_file_name, release_year, rating, status, description, synopsis, studio_name, created_at, updated_at",
        )
        .eq("is_archived", false)
        .order("rating", { ascending: false })
        .limit(100)

      if (moviesError) {
        console.error("[v0] Movies fetch error:", moviesError)
        return
      }

      if (!moviesData) {
        setAllMovies([])
        return
      }

      const moviesWithGenres = await Promise.all(
        moviesData.map(async (movie: any) => {
          const { data: genreData } = await supabase
            .from("movie_genres")
            .select("genres(name)")
            .eq("movie_id", movie.id)

          const genres = genreData?.map((g: any) => g.genres?.name).filter(Boolean) || []

          return {
            ...movie,
            image: movie.thumbnail_url || "/placeholder.svg",
            genres,
          }
        }),
      )

      console.log("[v0] Fetched movies data:", moviesWithGenres.length, "items")
      setAllMovies(moviesWithGenres as Movie[])
    } catch (err) {
      console.error("[v0] Fetch movies exception:", err)
    }
  }

  useEffect(() => {
    fetchAnime()
    fetchMovies()
  }, [])

  const filterByGenre = (items: (Anime | Movie)[]) => {
    if (selectedGenre === "All") return items
    return items.filter((item: any) => item.genres && item.genres.includes(selectedGenre))
  }

  const filteredAnime = filterByGenre(allAnime)
  const popularAnime = filteredAnime.slice(0, 6)
  const trendingAnime = filteredAnime.slice(6, 12)
  const topRatedAnime = filteredAnime.slice(12, 18)

  const filteredMovies = filterByGenre(allMovies)
  const popularMovies = filteredMovies.slice(0, 6)
  const trendingMovies = filteredMovies.slice(6, 12)

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <Navigation />
        <HeroSection />
      </div>

      <div className="space-y-8 md:space-y-12 pb-12 md:pb-20 relative z-10">
        {error && (
          <div className="px-4 md:px-8 py-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300 flex justify-between items-center">
            <span>Error loading anime: {error}</span>
            <button onClick={() => fetchAnime()} className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm">
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="px-4 md:px-8 text-muted-foreground flex justify-between items-center">
            <span>Loading data...</span>
            <button
              onClick={() => {
                fetchAnime()
                fetchMovies()
              }}
              className="px-3 py-1 bg-primary hover:bg-primary/80 rounded text-sm text-primary-foreground"
            >
              Refresh
            </button>
          </div>
        )}

        <ContinueWatching />

        <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />

        {!loading && !error && popularAnime.length > 0 && <AnimeRow title="Top Rated Anime" animes={popularAnime} />}

        {!loading && !error && popularMovies.length > 0 && (
          <AnimeRow
            title="Top Rated Movies"
            animes={popularMovies.map((m) => ({
              ...m,
              badge: "Movie",
              type: "movie",
            }))}
          />
        )}

        {!loading && !error && trendingAnime.length > 0 && (
          <AnimeRow
            title="Popular Anime"
            animes={trendingAnime.map((a) => ({
              ...a,
              badge: "Popular",
            }))}
          />
        )}

        {!loading && !error && trendingMovies.length > 0 && (
          <AnimeRow
            title="Popular Movies"
            animes={trendingMovies.map((m) => ({
              ...m,
              badge: "Movie",
              type: "movie",
            }))}
          />
        )}

        {!loading && !error && topRatedAnime.length > 0 && <AnimeRow title="More Anime" animes={topRatedAnime} />}

        {!loading && !error && allAnime.length === 0 && allMovies.length === 0 && (
          <div className="px-4 md:px-8 text-muted-foreground text-center py-12">
            No content found. Please add anime or movies data to Supabase.
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
