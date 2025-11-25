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
    image_url: "/anime9.jpg",
    rating: 9.5,
    year: 2019,
    seasons: 3,
    genres: "Action,Adventure,Supernatural",
  },
  {
    title: "Attack on Titan",
    description:
      "Humanity lives inside cities surrounded by enormous walls as a defense against the Titans. Eren fights for humanity's survival.",
    image_url: "/anime7.jpg",
    rating: 9.3,
    year: 2013,
    seasons: 4,
    genres: "Action,Drama,Fantasy",
  },
  {
    title: "Jujutsu Kaisen",
    description:
      "A high school student joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse and protect humanity.",
    image_url: "/anime10.jpg",
    rating: 9.1,
    year: 2020,
    seasons: 2,
    genres: "Action,Adventure,Supernatural",
  },
  {
    title: "My Hero Academia",
    description:
      "In a world where most people have superpowers, a powerless boy dreams of becoming a hero and attends the most prestigious hero academy.",
    image_url: "/anime8.jpg",
    rating: 8.9,
    year: 2016,
    seasons: 6,
    genres: "Action,Comedy,School",
  },
  {
    title: "Naruto Shippuden",
    description:
      "Naruto continues his journey to become the Hokage while battling powerful enemies and uncovering the secrets of the ninja world.",
    image_url: "/hero2.jpg",
    rating: 8.8,
    year: 2007,
    seasons: 6,
    genres: "Action,Adventure,Shounen",
  },
  {
    title: "One Piece",
    description:
      "Follow Luffy and his crew as they search for the legendary treasure One Piece and adventure across the Grand Line.",
    image_url: "/anime14.jpg",
    rating: 8.9,
    year: 1999,
    seasons: 20,
    genres: "Action,Adventure,Comedy",
  },
  {
    title: "Death Note",
    description:
      "A high school student finds a supernatural notebook that allows him to kill anyone by writing their name. He begins a secret war against crime.",
    image_url: "/anime15.jpg",
    rating: 9.0,
    year: 2006,
    seasons: 1,
    genres: "Thriller,Supernatural,Psychological",
  },
  {
    title: "Steins;Gate",
    description:
      "A group of friends discover a way to send messages to the past, triggering a series of events that could change the world.",
    image_url: "/anime16.jpg",
    rating: 9.1,
    year: 2011,
    seasons: 1,
    genres: "Sci-Fi,Thriller,Drama",
  },
  {
    title: "Fullmetal Alchemist",
    description:
      "Two brothers seek the Philosopher's Stone to restore their bodies after a failed alchemical experiment.",
    image_url: "/anime17.jpg",
    rating: 9.3,
    year: 2005,
    seasons: 1,
    genres: "Action,Adventure,Fantasy",
  },
  {
    title: "Code Geass",
    description:
      "A student gains the power to command anyone to obey him. He uses this ability to lead a rebellion against an oppressive empire.",
    image_url: "/anime18.jpg",
    rating: 8.8,
    year: 2006,
    seasons: 2,
    genres: "Action,Sci-Fi,School",
  },
]

async function seedAnime() {
  try {
    console.log("[v0] Starting anime database seed...")
    const { data, error } = await supabase.from("anime").insert(animeData).select()
    if (error) throw error
    console.log("[v0] Successfully seeded", animeData.length, "anime entries!")
  } catch (err) {
    console.error("[v0] Error:", err.message)
  }
}

seedAnime()
