import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://edzojevlzrwbiqyxklss.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkem9qZXZsenJ3YmlxeXhrbHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzA5MzgsImV4cCI6MjA3MTEwNjkzOH0.yhQpFcnYugnox6KEHMmD8YcNQYLmXFw0E0wvT-7WXuE"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkSchema() {
  try {
    console.log("[v0] Fetching anime table schema...")

    // Get one record to see what columns exist
    const { data, error } = await supabase.from("anime").select("*").limit(1)

    if (error) {
      console.error("[v0] Error fetching data:", error.message)
      return
    }

    console.log("[v0] Table structure:")
    if (data && data.length > 0) {
      console.log("[v0] Available columns:", Object.keys(data[0]))
    } else {
      console.log("[v0] Table is empty, checking allowed columns...")

      // Try inserting minimal data to see what columns are allowed
      const { error: insertError } = await supabase
        .from("anime")
        .insert([
          {
            title: "Test Anime",
            description: "Test",
            synopsis: "Test",
            thumbnail_url: "/test.jpg",
            rating: 8.5,
            release_year: 2024,
            episode_count: 12,
            studio_name: "Test Studio",
            status: "completed",
            added_by: "admin",
          },
        ])
        .select()

      if (insertError) {
        console.error("[v0] Insert error:", insertError.message)
        console.error("[v0] Full error details:", insertError)
      } else {
        console.log("[v0] Test insert successful! Table accepts these columns.")
      }
    }
  } catch (err) {
    console.error("[v0] Debug script error:", err.message)
  }
}

checkSchema()
