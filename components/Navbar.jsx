"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import StrayShieldLogo from "./StrayShieldLogo"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const type = localStorage.getItem("userType")
    setIsLoggedIn(!!token)
    setUserType(type)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userId")
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <nav className="border-b border-border bg-transparent backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-80 transition-opacity"
          >
            <StrayShieldLogo size="md" />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Stray Shield
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm">
              Home
            </Link>
            {isLoggedIn && userType === "citizen" && (
              <Link href="/citizen-dashboard" className="text-foreground hover:text-primary transition-colors text-sm">
                Adopt
              </Link>
            )}
            {isLoggedIn && userType === "citizen" && (
              <Link href="/report" className="text-foreground hover:text-primary transition-colors text-sm">
                Report
              </Link>
            )}
            {isLoggedIn && userType === "citizen" && (
              <Link href="/my-reports" className="text-foreground hover:text-primary transition-colors text-sm">
                My Reports
              </Link>
            )}

            {isLoggedIn && userType === "ngo" && (
              <>
                <Link href="/ngo-dashboard" className="text-foreground hover:text-primary transition-colors text-sm">
                  Dashboard
                </Link>
                <Link href="/ngo/adoption-board" className="text-foreground hover:text-primary transition-colors text-sm">
                  Adoption Board
                </Link>
              </>
            )}
            {!isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Sign Up
                </Link>
                <Link href="/login" className="px-4 py-2 text-foreground hover:text-primary transition-colors text-sm">
                  Login
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/" className="block text-foreground hover:text-primary transition-colors py-2 text-sm">
              Home
            </Link>
            {isLoggedIn && userType === "citizen" && (
              <Link href="/report" className="block text-foreground hover:text-primary transition-colors py-2 text-sm">
                Report
              </Link>
            )}
            {isLoggedIn && userType === "citizen" && (
              <Link href="/my-reports" className="block text-foreground hover:text-primary transition-colors py-2 text-sm">
                My Reports
              </Link>
            )}
            {isLoggedIn && userType === "ngo" && (
              <>
                <Link
                  href="/ngo-dashboard"
                  className="block text-foreground hover:text-primary transition-colors py-2 text-sm"
                >
                  Dashboard
                </Link>
                <Link href="/ngo/adoption-board" className="text-foreground hover:text-primary transition-colors text-sm">
                  Adoption Board
                </Link>
              </>
            )}
            {!isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="px-4 py-2 text-foreground text-center text-sm">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
