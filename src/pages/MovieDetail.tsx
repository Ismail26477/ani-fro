"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Play, Plus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Navigation from "@/components/Navigation"
import MovieRow from "@/components/MovieRow"
import Comments from "@/components/Comments"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [movie, setMovie] = useState<any>(null)
  const [movieLinksByLanguage, setMovieLinksByLanguage] = useState<{ [key: string]: any[] }>({})
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [relatedMovies, setRelatedMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return

      setLoading(true)
      setMovie(null)
      setMovieLinksByLanguage({})
      setRelatedMovies([])
      setAvailableLanguages([])
      setSelectedLanguage("")

      console.log("[v0] Fetching movie with ID:", id)

      const { data, error } = await supabase
        .from("movies")
        .select(
          "id, title, description, synopsis, thumbnail_url, thumbnail_file_path, thumbnail_file_name, release_year, duration, rating, status, studio_id, studio_name, language, created_at, updated_at, added_by, is_archived, archived_at, archived_by, archived_reason",
        )
        .eq("id", id)
        .eq("is_archived", false)
        .single()

      console.log("[v0] Movie data received:", data)
      console.log("[v0] Error (if any):", error)

      if (!error && data) {
        setMovie(data)

        const { data: links, error: linksError } = await supabase
          .from("movie_links")
          .select("id, platform, url, quality, language")
          .eq("movie_id", id)
          .order("language", { ascending: true })
          .order("platform", { ascending: true })

        console.log("[v0] Movie links query result:", links)
        console.log("[v0] Movie links error:", linksError)

        if (links && links.length > 0) {
          const grouped: { [key: string]: any[] } = {}
          links.forEach((link) => {
            const lang = link.language || "English"
            if (!grouped[lang]) {
              grouped[lang] = []
            }
            grouped[lang].push(link)
          })

          setMovieLinksByLanguage(grouped)

          const languages = Object.keys(grouped).sort()
          setAvailableLanguages(languages)
          setSelectedLanguage(languages[0] || "")

          console.log("[v0] Available languages:", languages)
        }

        const { data: related } = await supabase
          .from("movies")
          .select("id, title, thumbnail_url, thumbnail_file_path, thumbnail_file_name, rating")
          .neq("id", id)
          .eq("is_archived", false)
          .order("rating", { ascending: false })
          .limit(6)

        console.log("[v0] Related movies fetched:", related?.length || 0, "items")

        if (related) {
          setRelatedMovies(related.map((m) => ({ ...m, type: "movie" })))
        }
      }
      setLoading(false)
    }

    fetchMovie()
  }, [id])

  const handlePlay = async () => {
    if (!user) {
      setShowLoginDialog(true)
      return
    }

    await supabase.from("watch_history").upsert({
      user_id: user.id,
      movie_id: id,
      progress_seconds: 0,
      last_watched_at: new Date().toISOString(),
    })

    toast({
      title: "Starting playback",
      description: "Enjoy watching!",
    })
  }

  const handleShare = async () => {
    if (!movie) return

    const shareData = {
      title: movie.title,
      text: `Check out ${movie.title} on Anidost!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${movie.title} - ${window.location.href}`)
        toast({
          title: "Copied to clipboard",
          description: "Share link copied to your clipboard!",
        })
      }
    } catch (error) {
      console.log("[v0] Share error:", error)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
      </div>
    )

  if (!movie)
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="px-4 md:px-8 py-12 text-center text-muted-foreground">Movie not found</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative left-0 top-0 w-full h-auto z-0">
        <div className="aspect-video w-full max-h-[350px] md:max-h-[550px] overflow-hidden bg-background/50">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${movie.thumbnail_url || "/placeholder.svg"})` }}
          />
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 md:py-12 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Title and Quick Info */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
              <span className="font-medium">{movie.release_year}</span>
              {movie.duration && <span className="text-muted-foreground">{movie.duration}</span>}
              {movie.rating && (
                <span className="px-2 py-1 bg-foreground/10 rounded text-xs font-medium">{movie.rating}%</span>
              )}
              {movie.status && (
                <span className="px-2 py-1 bg-foreground/10 rounded text-xs font-medium">{movie.status}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-6 md:px-10"
                onClick={handlePlay}
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-background/20 backdrop-blur-sm border-foreground/20 hover:bg-background/30"
              >
                <Plus className="h-5 w-5" />
                My List
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-background/20 backdrop-blur-sm border-foreground/20 hover:bg-background/30"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden md:inline">Share</span>
              </Button>
            </div>
          </div>

          {/* Language Section */}
          {availableLanguages.length > 0 && (
            <div className="mb-8 flex items-center gap-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Language:</span>
              <div className="flex gap-2 flex-wrap">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                      selectedLanguage === lang
                        ? "bg-foreground text-background"
                        : "bg-foreground/10 hover:bg-foreground/20"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-8 py-8 border-t border-foreground/10">
            {/* About Section */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">About</h2>
              <p className="text-foreground/80 leading-relaxed">{movie.description || "No description available"}</p>

              {/* Synopsis Section */}
              {movie.synopsis && (
                <div className="mt-8 pt-8 border-t border-foreground/10 space-y-4">
                  <h2 className="text-2xl font-bold">Synopsis</h2>
                  <p className="text-foreground/80 leading-relaxed">{movie.synopsis}</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Status</h3>
                <p className="text-base font-medium">{movie.status || "N/A"}</p>
              </div>
              {movie.studio_name && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Studio</h3>
                  <p className="text-base font-medium">{movie.studio_name}</p>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                  Release Year
                </h3>
                <p className="text-base font-medium">{movie.release_year}</p>
              </div>
              {movie.duration && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Duration
                  </h3>
                  <p className="text-base font-medium">{movie.duration}</p>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Rating</h3>
                <p className="text-base font-medium">{movie.rating || "N/A"}</p>
              </div>
              {movie.added_by && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Added by
                  </h3>
                  <p className="text-sm">{movie.added_by}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedLanguage && movieLinksByLanguage[selectedLanguage]?.length > 0 && (
        <div className="px-4 md:px-8 py-12 md:py-16 space-y-8 max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-6">Available On</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movieLinksByLanguage[selectedLanguage].map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-foreground/10 rounded-lg hover:bg-foreground/5 transition-colors text-center font-medium"
                >
                  {link.platform}
                  {link.quality && <div className="text-xs text-muted-foreground mt-1">{link.quality}</div>}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-8 py-12 md:py-16 max-w-6xl mx-auto">
        <Comments movieId={id!} />
      </div>

      <div className="pb-12 md:pb-20">
        <MovieRow title="More Like This" movies={relatedMovies} />
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to sign in to watch movies. Please log in to your account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setShowLoginDialog(false)
                navigate("/auth")
              }}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              Go to Login
            </Button>
            <Button onClick={() => setShowLoginDialog(false)} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MovieDetail

