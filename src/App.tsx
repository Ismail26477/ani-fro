import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AnimeDetail from "./pages/AnimeDetail"
import Anime from "./pages/Anime"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"
import Movies from "./pages/Movies" // Import Movies page
import MovieDetail from "./pages/MovieDetail" // Import MovieDetail page

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/movies" element={<Movies />} /> {/* Added Movies route */}
          <Route path="/movie/:id" element={<MovieDetail />} /> {/* Added MovieDetail route */}
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
