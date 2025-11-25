"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"

interface Episode {
  number: number
  title: string
  thumbnail: string
  duration: number
  links?: Record<string, string>
  language?: string
  season?: number
}

interface EpisodesProps {
  episodes: Episode[]
  animeThumbnail?: string
  availableLanguages?: string[]
  availableSeasons?: number[]
}

const Episodes = ({ episodes, animeThumbnail, availableLanguages = [], availableSeasons = [] }: EpisodesProps) => {
  const [language, setLanguage] = useState<string>(availableLanguages[0] || "")
  const [season, setSeason] = useState<number>(availableSeasons[0] || 1)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const filteredEpisodes = useMemo(() => {
    let filtered = episodes

    if (language) {
      filtered = filtered.filter((ep) => ep.language?.toLowerCase() === language.toLowerCase())
    }

    if (season) {
      filtered = filtered.filter((ep) => (ep.season || 1) === season)
    }

    return filtered
  }, [episodes, language, season])

  const handleWatchClick = (url: string) => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  const handleGoToLogin = () => {
    setShowLoginDialog(false)
    navigate("/auth")
  }

  return (
    <div className="space-y-6">
      {availableLanguages.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">Language:</span>
          <div className="flex gap-2 flex-wrap">
            {availableLanguages.map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage(lang)}
                className="text-xs"
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Header with Season Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Episodes</h2>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Season:</span>
          <Select value={season.toString()} onValueChange={(val) => setSeason(Number.parseInt(val))}>
            <SelectTrigger className="w-[120px] border-foreground/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableSeasons.length > 0 ? (
                availableSeasons.map((s) => (
                  <SelectItem key={s} value={s.toString()}>
                    Season {s}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="1">Season 1</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredEpisodes.length > 0 ? (
          filteredEpisodes.map((episode) => (
            <div
              key={episode.number}
              className="flex gap-4 bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-32 md:w-40 lg:w-48 aspect-video bg-muted">
                <img
                  src={episode.thumbnail || "/placeholder.svg"}
                  alt={`Episode ${episode.number}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Episode Details */}
              <div className="flex-1 py-3 pr-4 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Episode {episode.number}</span>
                    <span>•</span>
                    <span>{episode.duration} min</span>
                  </div>
                  <h3 className="font-semibold text-foreground line-clamp-1">{episode.title}</h3>
                </div>

                {/* Action Buttons - Display platform-specific links dynamically */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {episode.links && Object.keys(episode.links).length > 0 ? (
                    Object.entries(episode.links).map(([platform, url]) => (
                      <Button
                        key={platform}
                        variant="outline"
                        size="sm"
                        className="text-xs border-foreground/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors bg-transparent"
                        onClick={() => handleWatchClick(url)}
                      >
                        {platform}
                      </Button>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No links available</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No episodes available for the selected language and season
          </div>
        )}
      </div>
    </div>
  )
}


export default Episodes
