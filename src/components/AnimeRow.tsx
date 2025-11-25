"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import AnimeCard from "./AnimeCard"

interface Anime {
  id: string
  title: string
  image: string
  badge?: string
  type?: "anime" | "movie"
}

interface AnimeRowProps {
  title: string
  animes: Anime[]
}

const AnimeRow = ({ title, animes }: AnimeRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 px-4 md:px-8">
      <h2 className="text-lg md:text-2xl font-bold">{title}</h2>

      <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {animes.map((anime) => (
            <div key={anime.id} className="flex-none w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%]">
              <AnimeCard {...anime} type={anime.type} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("left")}
          className={`absolute -left-4 md:-left-6 top-1/3 -translate-y-1/2 z-20 text-white hover:text-white/80 transition-opacity duration-200 cursor-pointer ${
            isHovering || window.innerWidth < 768 ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 stroke-[3]" />
        </button>

        <button
          onClick={() => scroll("right")}
          className={`absolute -right-4 md:-right-6 top-1/3 -translate-y-1/2 z-20 text-white hover:text-white/80 transition-opacity duration-200 cursor-pointer ${
            isHovering || window.innerWidth < 768 ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 stroke-[3]" />
        </button>
      </div>
    </div>
  )
}

export default AnimeRow
