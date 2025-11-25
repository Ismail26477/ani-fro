"use client"

import { Search, Bell, User, LogOut, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchModal } from "./SearchModal"
import { useState, useEffect } from "react"

const Navigation = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 30) setIsVisible(true)
      else setIsVisible(false)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { name: "Anime", path: "/anime" },
    { name: "Movies", path: "/movies" },
  ]

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 z-50 px-0 py-0
        transition-all duration-300
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}
      `}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center">
  <img
    src="/logo.png"
    alt="Anidost Logo"
    className="
      h-16
      md:h-17
      w-auto 
      object-contain 
      drop-shadow-[0_0_12px_rgba(255,0,128,0.6)]
    "
  />
</Link>



          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-white
                  transition-all duration-300
                  hover:text-purple-400
                  hover:drop-shadow-[0_0_12px_rgba(168,85,247,1)]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">
          {/* DESKTOP SEARCH */}
          <div className="hidden md:block">
            <SearchModal />
          </div>

          {/* MOBILE SEARCH BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-white/10"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-white" />
          </Button>

          {/* BELL */}
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Bell className="h-5 w-5 text-white" />
          </Button>

          {/* USER MENU */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <User className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <User className="h-5 w-5 text-white" />
              </Button>
            </Link>
          )}

          {/* MOBILE MENU TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
  <div
    className="  pb-4 space-y-2  pt-4
    text-right flex flex-col items-end"
  >
    {navItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className="px-4 py-2 text-sm font-medium
        text-white hover:text-purple-400
        hover:drop-shadow-[0_0_10px_rgba(168,85,247,1)]
        transition text-right"
      >
        {item.name}
      </Link>
    ))}
  </div>
)}


      {/* MOBILE SEARCH MODAL */}
      {searchOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
          <SearchModal onClose={() => setSearchOpen(false)} />
        </div>
      )}
    </nav>
  )
}

export default Navigation
