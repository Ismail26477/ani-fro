import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://edzojevlzrwbiqyxklss.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkem9qZXZsenJ3YmlxeXhrbHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzA5MzgsImV4cCI6MjA3MTEwNjkzOH0.yhQpFcnYugnox6KEHMmD8YcNQYLmXFw0E0wvT-7WXuE"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const animeData = [
  {
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    thumbnail: "/anime9.jpg",
    rating: 9.5,
    year: 2019,
    episodes: 26,
    status: "Ongoing",
  },
  {
    title: "Attack on Titan",
    description: "Humanity lives inside cities surrounded by enormous walls as a defense against the Titans. Eren fights for humanity's survival.",
    thumbnail: "/anime7.jpg",
    rating: 9.3,
    year: 2013,
    episodes: 75,
    status: "Completed",
  },
  {
    title: "Jujutsu Kaisen",
    description: "A high school student joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse and protect humanity.",
    thumbnail: "/anime10.jpg",
    rating: 9.1,
    year: 2020,
    episodes: 48,
    status: "Ongoing",
  },
  {
    title: "My Hero Academia",
    description: "In a world where most people have superpowers, a powerless boy dreams of becoming a hero and attends the most prestigious hero academy.",
    thumbnail: "/anime8.jpg",
    rating: 8.9,
    year: 2016,
    episodes: 130,
    status: "Ongoing",
  },
  {
    title: "Naruto Shippuden",
    description: "Naruto continues his journey to become the Hokage while battling powerful enemies and uncovering the secrets of the ninja world.",
    thumbnail: "/hero2.jpg",
    rating: 8.8,
    year: 2007,
    episodes: 500,
    status: "Completed",
  },
  {
    title: "One Piece",
    description: "Follow Luffy and his crew as they search for the legendary treasure One Piece and adventure across the Grand Line.",
    thumbnail: "/anime14.jpg",
    rating: 8.9,
    year: 1999,
    episodes: 1000,
    status: "Ongoing",
  },
  {
    title: "Death Note",
    description: "A high school student finds a supernatural notebook that allows him to kill anyone by writing their name. He begins a secret war against crime.",
    thumbnail: "/anime15.jpg",
    rating: 9.0,
    year: 2006,
    episodes: 37,
    status: "Completed",
  },
  {
    title: "Steins;Gate",
    description: "A group of friends discover a way to send messages to the past, triggering a series of events that could change the world.",
    thumbnail: "/anime16.jpg",
    rating: 9.1,
    year: 2011,
    episodes: 24,
    status: "Completed",
  },
  {
    title: "Fullmetal Alchemist",
    description: "Two brothers seek the Philosopher's Stone to restore their bodies after a failed alchemical experiment.",
    thumbnail: "/anime17.jpg",
    rating: 9.3,
    year: 2005,
    episodes: 51,
    status: "Completed",
  },
  {
    title: "Code Geass",
    description: "A student gains the power to command anyone to obey him. He uses this ability to lead a rebellion against an oppressive empire.",
    thumbnail: "/anime18.jpg",
    rating: 8.8,
    year: 2006,
    episodes: 50,
    status: "Completed",
  },
  {
    title: "Mob Psycho 100",
    description: "A middle school boy with psychic powers tries to live a normal life while managing his overwhelming abilities.",
    thumbnail: "/anime14.jpg",
    rating: 8.9,
    year: 2016,
    episodes: 37,
    status: "Completed",
  },
  {
    title: "Cowboy Bebop",
    description: "A ragtag group of bounty hunters travel through space on their spaceship, taking on various missions and adventures.",
    thumbnail: "/anime15.jpg",
    rating: 8.9,
    year: 1998,
    episodes: 26,
    status: "Completed",
  },
]

async function seedAnime() {
  try {
    console.log("[v0] Starting anime database seed...")
    console.log("[v0] Connecting to Supabase at", SUPABASE_URL)

    const { data: checkData, error: checkError } = await supabase
      .from("anime")
      .select("id")
      .limit(1)

    if (checkError) {
      console.error("[v0] ERROR: Anime table does not exist!")
      console.error("[v0] Error:", checkError.message)
      return
    }

    console.log("[v0] Anime table found!")

    console.log("[v0] Inserting new anime data...")
    const { data, error: insertError } = await supabase
      .from("anime")
      .insert(animeData)
      .select()

    if (insertError) {
      console.error("[v0] ERROR inserting data:", insertError.message)
      console.error("[v0] Code:", insertError.code)
      console.error("[v0] Details:", insertError.details)
      return
    }

    console.log("[v0] ✓ Successfully seeded anime data!")
    console.log("[v0] ✓ Inserted", data?.length || 0, "anime entries")
    console.log("[v0] ✓ Your UI should now display the anime data!")
    console.log("[v0] ✓ Run: npm run dev")
  } catch (err) {
    console.error("[v0] Seed script error:", err.message)
  }
}

seedAnime()
