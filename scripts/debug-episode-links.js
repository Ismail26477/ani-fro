import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://edzojevlzrwbiqyxklss.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkem9qZXZsenJ3YmlxeXhrbHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzA5MzgsImV4cCI6MjA3MTEwNjkzOH0.yhQpFcnYugnox6KEHMmD8YcNQYLmXFw0E0wvT-7WXuE"

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugEpisodeLinks() {
  console.log("[DEBUG] Checking episode_links table...\n")

  // Check if episode_links table has any data
  const { data: allLinks, error: linksError } = await supabase.from("episode_links").select("*").limit(10)

  if (linksError) {
    console.log("[ERROR] Failed to fetch episode_links:", linksError.message)
  } else {
    console.log(`[SUCCESS] Found ${allLinks?.length || 0} episode links in total`)
    if (allLinks && allLinks.length > 0) {
      console.log("[SAMPLE] First episode link:", allLinks[0])
      console.log("[COLUMNS] Available columns:", Object.keys(allLinks[0]))
    }
  }

  // Check episodes table
  const { data: episodes, error: episodesError } = await supabase
    .from("episodes")
    .select("id, episode_number, anime_id")
    .limit(5)

  if (episodesError) {
    console.log("[ERROR] Failed to fetch episodes:", episodesError.message)
  } else {
    console.log(`\n[SUCCESS] Found ${episodes?.length || 0} episodes`)
    if (episodes && episodes.length > 0) {
      console.log("[SAMPLE] First episode:", episodes[0])

      // Try to find links for this episode
      const firstEpisodeId = episodes[0].id
      const { data: linksForEpisode } = await supabase
        .from("episode_links")
        .select("*")
        .eq("episode_id", firstEpisodeId)

      console.log(`\n[CHECK] Links for episode ${firstEpisodeId}:`, linksForEpisode?.length || 0)
      if (linksForEpisode && linksForEpisode.length > 0) {
        console.log("[DETAILS]", linksForEpisode)
      }
    }
  }
}

debugEpisodeLinks()
