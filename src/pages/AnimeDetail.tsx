"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Play, Plus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Navigation from "@/components/Navigation"
import AnimeRow from "@/components/AnimeRow"
import Comments from "@/components/Comments"
import Episodes from "@/components/Episodes"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

const AnimeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [anime, setAnime] = useState<any>(null)
  const [relatedAnime, setRelatedAnime] = useState<any[]>([])
  const [episodeLinks, setEpisodeLinks] = useState<any[]>([])
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return

      setLoading(true)
      setAnime(null)
      setRelatedAnime([])
      setEpisodeLinks([])
      setAvailableLanguages([])
      setAvailableSeasons([])

      console.log("[v0] Fetching anime with ID:", id)

      const { data, error } = await supabase
        .from("anime")
        .select(
          "id, title, description, synopsis, thumbnail_url, thumbnail_file_path, thumbnail_file_name, release_year, episode_count, rating, status, studio_id, studio_name, created_at, updated_at, added_by, is_archived, archived_at, archived_by, archived_reason",
        )
        .eq("id", id)
        .eq("is_archived", false)
        .single()

      console.log("[v0] Anime data received:", data)
      console.log("[v0] Error (if any):", error)

      if (!error && data) {
        setAnime(data)

        const { data: links, error: linksError } = await supabase
          .from("episodes")
          .select("id, episode_number, language, season, episode_links(platform, url)")
          .eq("anime_id", id)
          .order("episode_number", { ascending: true })

        console.log("[v0] Episodes with links query result:", links)
        console.log("[v0] Episodes with links error:", linksError)

        if (links) {
          setEpisodeLinks(links)

          const languages = [...new Set(links.map((ep: any) => ep.language).filter(Boolean))]
          console.log("[v0] Available languages:", languages)
          setAvailableLanguages(languages)

          const seasons = [...new Set(links.map((ep: any) => ep.season || 1).filter(Boolean))]
          const sortedSeasons = (seasons as number[]).sort((a, b) => a - b)
          console.log("[v0] Available seasons:", sortedSeasons)
          setAvailableSeasons(sortedSeasons)
        }

        const { data: related } = await supabase
          .from("anime")
          .select("id, title, thumbnail_url, thumbnail_file_path, thumbnail_file_name, rating")
          .neq("id", id)
          .eq("is_archived", false)
          .order("rating", { ascending: false })
          .limit(6)

        console.log("[v0] Related anime fetched:", related?.length || 0, "items")

        if (related) {
          setRelatedAnime(related)
        }
      }
      setLoading(false)
    }

    fetchAnime()
  }, [id])

  const handlePlay = async () => {
    if (!user) {
      setShowLoginDialog(true)
      return
    }

    await supabase.from("watch_history").upsert({
      user_id: user.id,
      anime_id: id,
      episode_number: 1,
      progress_seconds: 0,
      last_watched_at: new Date().toISOString(),
    })

    toast({
      title: "Starting playback",
      description: "Enjoy watching!",
    })
  }

  const handleShare = async () => {
    if (!anime) return

    const shareData = {
      title: anime.title,
      text: `Check out ${anime.title} on Anidost!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${anime.title} - ${window.location.href}`)
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

  if (!anime)
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="px-4 md:px-8 py-12 text-center text-muted-foreground">Anime not found</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative left-0 top-0 w-full h-auto z-0">
        <div className="aspect-video w-full max-h-[350px] md:max-h-[550px] overflow-hidden bg-background/50">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${anime.thumbnail_url || "/placeholder.svg"})` }}
          />
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 md:py-12 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Title and Quick Info */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{anime.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
              <span className="font-medium">{anime.release_year}</span>
              <span className="text-muted-foreground">{anime.episode_count} Episodes</span>
              <span className="px-2 py-1 bg-foreground/10 rounded text-xs font-medium">{anime.rating}%</span>
              <span className="px-2 py-1 bg-foreground/10 rounded text-xs font-medium">{anime.status}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-6 md:px-10"
                onClick={handlePlay}
              >
                <Play className="h-5 w-5 fill-current" />
                Watch
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

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-8 py-8 border-t border-foreground/10">
            {/* About Section */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold">About</h2>
              <p className="text-foreground/80 leading-relaxed">{anime.description || "No description available"}</p>

              {/* Synopsis Section */}
              {anime.synopsis && (
                <div className="mt-8 pt-8 border-t border-foreground/10 space-y-4">
                  <h2 className="text-2xl font-bold">Synopsis</h2>
                  <p className="text-foreground/80 leading-relaxed">{anime.synopsis}</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Status</h3>
                <p className="text-base font-medium">{anime.status}</p>
              </div>
              {anime.studio_name && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Studio</h3>
                  <p className="text-base font-medium">{anime.studio_name}</p>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                  Release Year
                </h3>
                <p className="text-base font-medium">{anime.release_year}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Episodes</h3>
                <p className="text-base font-medium">{anime.episode_count}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Rating</h3>
                <p className="text-base font-medium">{anime.rating || "N/A"}</p>
              </div>
              {anime.added_by && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Added by
                  </h3>
                  <p className="text-sm">{anime.added_by}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="px-4 md:px-8 py-12 md:py-16 space-y-8 max-w-6xl mx-auto">
        <Episodes
          episodes={Array.from({ length: anime.episode_count }, (_, i) => {
            const epNum = i + 1
            const episodeData = episodeLinks.find((ep: any) => ep.episode_number === epNum)
            const linksByPlatform = (episodeData?.episode_links || []).reduce(
              (acc: Record<string, string>, link: any) => {
                acc[link.platform] = link.url
                return acc
              },
              {} as Record<string, string>,
            )

            return {
              number: epNum,
              title: `Episode ${epNum}`,
              thumbnail: anime.thumbnail_url,
              duration: 24,
              links: linksByPlatform,
              language: episodeData?.language || "Unknown",
              season: episodeData?.season || 1,
            }
          })}
          availableLanguages={availableLanguages}
          availableSeasons={availableSeasons}
        />
      </div>

      {/* Comments Section */}
      <div className="px-4 md:px-8 py-12 md:py-16 max-w-6xl mx-auto">
        <Comments animeId={id!} />
      </div>

      {/* Related Anime */}
      <div className="pb-12 md:pb-20">
        <AnimeRow
          title="More Like This"
          animes={relatedAnime.map((a) => ({
            id: a.id,
            title: a.title,
            image: a.thumbnail_url || "/placeholder.svg",
          }))}
        />
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to sign in to watch anime. Please log in to your account to continue.
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

export default AnimeDetail
