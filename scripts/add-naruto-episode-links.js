const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = "https://edzojevlzrwbiqyxklss.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkem9qZXZsenJ3YmlxeXhrbHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzA5MzgsImV4cCI6MjA3MTEwNjkzOH0.yhQpFcnYugnox6KEHMmD8YcNQYLmXFw0E0wvT-7WXuE"
const supabase = createClient(supabaseUrl, supabaseKey)

const narutoAnimeId = "e4c5daba-c574-4084-94a0-1cfa8ad7e890"

async function addNarutoEpisodeLinks() {
  console.log("[v0] Fetching Naruto episodes...")

  const { data: episodes, error: episodesError } = await supabase
    .from("episodes")
    .select("id, episode_number")
    .eq("anime_id", narutoAnimeId)
    .order("episode_number", { ascending: true })

  if (episodesError) {
    console.error("[v0] Error fetching episodes:", episodesError)
    return
  }

  console.log("[v0] Found episodes:", episodes?.length || 0)

  if (!episodes || episodes.length === 0) {
    console.log("[v0] No episodes found for Naruto")
    return
  }

  // Sample episode links data
  const episodeLinksToAdd = episodes.slice(0, 3).map((ep) => ({
    episode_id: ep.id,
    platform: "WatchDT",
    url: `https://youtu.be/watch?v=naruto-ep${ep.episode_number}`,
    quality: "720p",
  }))

  console.log("[v0] Adding episode links:", episodeLinksToAdd.length)

  const { data, error } = await supabase.from("episode_links").insert(episodeLinksToAdd).select()

  if (error) {
    console.error("[v0] Error adding episode links:", error)
  } else {
    console.log("[v0] Successfully added episode links:", data?.length || 0)
  }
}

addNarutoEpisodeLinks()
