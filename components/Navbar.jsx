"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import StrayShieldLogo from "./StrayShieldLogo"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const type = localStorage.getItem("userType")
    setIsLoggedIn(!!token)
    setUserType(type)
    setIsOpen(false) // close mobile menu on navigation
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userId")
    setIsLoggedIn(false)
    router.push("/")
  }

  const navLinks = [
    { name: "Home", href: "/", show: true },
    { name: "Adopt", href: "/citizen-dashboard", show: isLoggedIn && userType === "citizen" },
    { name: "Report", href: "/report", show: isLoggedIn && userType === "citizen" },
    { name: "My Reports", href: "/my-reports", show: isLoggedIn && userType === "citizen" },
    { name: "Dashboard", href: "/ngo-dashboard", show: isLoggedIn && userType === "ngo" },
    { name: "Adoption Board", href: "/ngo/adoption-board", show: isLoggedIn && userType === "ngo" }
  ].filter(link => link.show)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-transparent backdrop-blur-2xl shadow-sm border-b border-white/10" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link
            href="/"
            className="group flex items-center gap-3 font-bold text-xl text-foreground transition-all duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <StrayShieldLogo size="md" />
            </div>
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-blue-500 bg-clip-text text-transparent transform origin-left transition-transform group-hover:scale-105">
              Stray Shield
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-base font-bold transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {pathname === link.href && (
                    <motion.div
                      layoutId="active-nav-slider"
                      className="absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r from-primary to-blue-500 rounded-t-lg"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-base font-bold text-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] hover:scale-105 transition-all text-base font-bold"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-6 py-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full transition-all text-base font-bold"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 text-foreground bg-secondary/50 rounded-full backdrop-blur-md transition-colors hover:bg-secondary"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl overflow-hidden shadow-lg"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link) => (
                <motion.div key={link.href} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={link.href}
                    className={`block px-5 py-4 rounded-2xl transition-all ${pathname === link.href
                      ? "bg-primary/15 text-primary font-black border border-primary/20"
                      : "text-foreground font-bold hover:bg-secondary/50"
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-3 bg-secondary/50 text-foreground text-center rounded-2xl font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-3 bg-primary text-primary-foreground text-center rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-2xl font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}