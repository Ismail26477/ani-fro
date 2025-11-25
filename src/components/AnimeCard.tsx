import { Link } from "react-router-dom"

interface AnimeCardProps {
  id: string
  title: string
  image: string
  badge?: string
  type?: "anime" | "movie"
}

const AnimeCard = ({ id, title, image, badge, type = "anime" }: AnimeCardProps) => {
  const routePath = type === "movie" ? `/movie/${id}` : `/anime/${id}`

  return (
    <Link to={routePath} className="group relative block">
      <div className="relative aspect-auto rounded-md overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
        />

        {/* Gradient overlay - always visible to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-1 text-xs font-semibold rounded">{badge}</div>
        )}

        {/* Title at bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold line-clamp-2 drop-shadow-lg">{title}</h3>
        </div>
      </div>
    </Link>
  )
}

export default AnimeCard
