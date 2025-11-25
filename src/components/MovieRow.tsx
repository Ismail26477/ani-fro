"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import MovieCard from "./MovieCard"

interface Movie {
  id: string
  title: string
  thumbnail_url?: string
  thumbnail_file_path?: string
  thumbnail_file_name?: string
  rating?: number
  release_year?: number
  type?: "movie"
}

interface MovieRowProps {
  title: string
  movies: Movie[]
}

const MovieRow = ({ title, movies }: MovieRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [movies])

  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
  }

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = direction === "left" ? -container.offsetWidth * 0.8 : container.offsetWidth * 0.8

    container.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 md:space-y-4 px-4 md:px-8">
      <h2 className="text-lg md:text-2xl font-bold">{title}</h2>

      <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className={`absolute -left-4 md:-left-6 top-1/3 -translate-y-1/2 z-20 text-white hover:text-white/80 transition-opacity duration-200 cursor-pointer ${
            isHovering || window.innerWidth < 768 ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 stroke-[3]" />
        </button>

        {/* Carousel container */}
        <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%]">
              <MovieCard
                id={movie.id}
                title={movie.title}
                image={movie.thumbnail_url || movie.thumbnail_file_path || "/placeholder.svg"}
                year={movie.release_year}
                type="movie"
              />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
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

export default MovieRow
