import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://edzojevlzrwbiqyxklss.supabase.co"
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkem9qZXZsenJ3YmlxeXhrbHNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzA5MzgsImV4cCI6MjA3MTEwNjkzOH0.yhQpFcnYugnox6KEHMmD8YcNQYLmXFw0E0wvT-7WXuE"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const animeData = [
  {
    title: "Demon Slayer: Kimetsu no Yaiba",
    description:
      "A family is attacked by demons and only two members survive. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    synopsis: "Tanjiro embarks on a journey to find a cure for his sister who has been turned into a demon.",
    release_year: 2019,
    episode_count: 50,
    studio_name: "Ufotable",
    rating: 9.5,
    status: "Completed",
    thumbnail_url: "/anime9.jpg",
    thumbnail_file_name: "anime9.jpg",
    is_archived: false,
  },
  {
    title: "Attack on Titan",
    description:
      "Humanity lives inside cities surrounded by enormous walls as a defense against the Titans. Eren fights for humanity's survival.",
    synopsis:
      "In a world where massive, humanoid Titans roam freely outside walled cities, a young man must join the fight against them.",
    release_year: 2013,
    episode_count: 94,
    studio_name: "WIT Studio",
    rating: 9.3,
    status: "Completed",
    thumbnail_url: "/anime7.jpg",
    thumbnail_file_name: "anime7.jpg",
    is_archived: false,
  },
  {
    title: "Jujutsu Kaisen",
    description:
      "A high school student joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse and protect humanity.",
    synopsis: "Yuji Itadori discovers a world of curses and becomes the vessel for the strongest curse, Ryomen Sukuna.",
    release_year: 2020,
    episode_count: 50,
    studio_name: "MAPPA",
    rating: 9.1,
    status: "Ongoing",
    thumbnail_url: "/anime10.jpg",
    thumbnail_file_name: "anime10.jpg",
    is_archived: false,
  },
  {
    title: "My Hero Academia",
    description:
      "In a world where most people have superpowers, a powerless boy dreams of becoming a hero and attends the most prestigious hero academy.",
    synopsis: "Deku attends UA High School to become a Pro Hero despite having no Quirk initially.",
    release_year: 2016,
    episode_count: 120,
    studio_name: "Bones",
    rating: 8.9,
    status: "Ongoing",
    thumbnail_url: "/anime8.jpg",
    thumbnail_file_name: "anime8.jpg",
    is_archived: false,
  },
  {
    title: "Naruto Shippuden",
    description:
      "Naruto continues his journey to become the Hokage while battling powerful enemies and uncovering the secrets of the ninja world.",
    synopsis:
      "After a two-year training journey, Naruto returns to protect his friends from the terrorist organization Akatsuki.",
    release_year: 2007,
    episode_count: 500,
    studio_name: "Studio Pierrot",
    rating: 8.8,
    status: "Completed",
    thumbnail_url: "/anime12.jpg",
    thumbnail_file_name: "anime12.jpg",
    is_archived: false,
  },
  {
    title: "One Piece",
    description:
      "Follow Luffy and his crew as they search for the legendary treasure One Piece and adventure across the Grand Line.",
    synopsis: "Monkey D. Luffy sets out to sea to become the Pirate King and find the legendary treasure, One Piece.",
    release_year: 1999,
    episode_count: 1050,
    studio_name: "Toei Animation",
    rating: 8.9,
    status: "Ongoing",
    thumbnail_url: "/anime14.jpg",
    thumbnail_file_name: "anime14.jpg",
    is_archived: false,
  },
  {
    title: "Death Note",
    description:
      "A high school student finds a supernatural notebook that allows him to kill anyone by writing their name. He begins a secret war against crime.",
    synopsis:
      "Light Yagami discovers a notebook that can kill anyone. He uses it to create a new world free of criminals.",
    release_year: 2006,
    episode_count: 37,
    studio_name: "Madhouse",
    rating: 9.0,
    status: "Completed",
    thumbnail_url: "/anime15.jpg",
    thumbnail_file_name: "anime15.jpg",
    is_archived: false,
  },
  {
    title: "Steins;Gate",
    description:
      "A group of friends discover a way to send messages to the past, triggering a series of events that could change the world.",
    synopsis:
      "Okabe Rintarou discovers a method to send messages back in time, unintentionally starting a time travel arms race.",
    release_year: 2011,
    episode_count: 25,
    studio_name: "White Fox",
    rating: 9.1,
    status: "Completed",
    thumbnail_url: "/anime16.jpg",
    thumbnail_file_name: "anime16.jpg",
    is_archived: false,
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    description:
      "Two brothers seek the Philosopher's Stone to restore their bodies after a failed alchemical experiment.",
    synopsis:
      "Edward and Alphonse search for the Philosopher's Stone to undo the consequences of their failed alchemy experiment.",
    release_year: 2009,
    episode_count: 64,
    studio_name: "Bones",
    rating: 9.3,
    status: "Completed",
    thumbnail_url: "/anime17.jpg",
    thumbnail_file_name: "anime17.jpg",
    is_archived: false,
  },
  {
    title: "Code Geass",
    description:
      "A student gains the power to command anyone to obey him. He uses this ability to lead a rebellion against an oppressive empire.",
    synopsis:
      "Lelouch vi Britannia gains the power to command anyone and leads a rebellion against the Holy Britannian Empire.",
    release_year: 2006,
    episode_count: 50,
    studio_name: "Sunrise",
    rating: 8.8,
    status: "Completed",
    thumbnail_url: "/anime18.jpg",
    thumbnail_file_name: "anime18.jpg",
    is_archived: false,
  },
  {
    title: "Mob Psycho 100",
    description:
      "A middle school boy with psychic powers tries to live a normal life while managing his overwhelming abilities.",
    synopsis: "Mob, a psychic middle school boy, tries to live a normal life while helping others with his powers.",
    release_year: 2016,
    episode_count: 38,
    studio_name: "Bones",
    rating: 8.9,
    status: "Completed",
    thumbnail_url: "/anime11.jpg",
    thumbnail_file_name: "anime11.jpg",
    is_archived: false,
  },
  {
    title: "Cowboy Bebop",
    description:
      "A ragtag group of bounty hunters travel through space on their spaceship, taking on various missions and adventures.",
    synopsis: "A crew of misfits travels through space taking on bounty hunting jobs in the year 2071.",
    release_year: 1998,
    episode_count: 26,
    studio_name: "Sunrise",
    rating: 8.9,
    status: "Completed",
    thumbnail_url: "/anime13.jpg",
    thumbnail_file_name: "anime13.jpg",
    is_archived: false,
  },
]

async function seedAnime() {
  try {
    console.log("[v0] Starting anime database seed...")
    console.log("[v0] Connecting to Supabase at", SUPABASE_URL)

    // Check if table exists by trying to fetch one record
    const { data: checkData, error: checkError } = await supabase.from("anime").select("*").limit(1)

    if (checkError) {
      console.error("[v0] Error checking anime table:", checkError.message)
      console.log("[v0] The 'anime' table may not exist in your Supabase database yet.")
      return
    }

    console.log("[v0] Anime table exists. Current records:", checkData?.length || 0)

    // Insert anime data
    const { data, error: insertError } = await supabase.from("anime").insert(animeData).select()

    if (insertError) {
      console.error("[v0] Error inserting anime data:", insertError.message)
      console.error("[v0] Full error:", insertError)
      return
    }

    console.log("[v0] Successfully seeded anime data!")
    console.log("[v0] Inserted", data?.length || animeData.length, "anime entries")
    console.log("[v0] Your UI should now display the anime data!")
  } catch (err) {
    console.error("[v0] Seed script error:", err.message)
  }
}

seedAnime()
