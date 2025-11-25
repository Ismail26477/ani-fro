import { Link } from "react-router-dom"
import { Star } from "lucide-react"

interface MovieCardProps {
  id: string
  title: string
  image: string
  rating?: number
  year?: number
}

const MovieCard = ({ id, title, image, rating, year }: MovieCardProps) => {
  return (
    <Link to={`/movie/${id}`} className="group relative block">
      <div className="relative aspect-auto rounded-md overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Gradient overlay - always visible for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-100" />

        {/* Content section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 space-y-2">
          {/* Title */}
          <h3 className="text-sm md:text-base font-semibold line-clamp-2 drop-shadow-lg">{title}</h3>

          {/* Rating and Year */}
          <div className="flex items-center gap-3 text-xs md:text-sm text-foreground/90">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}/10</span>
              </div>
            )}
            {year && <span className="text-foreground/70">{year}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
