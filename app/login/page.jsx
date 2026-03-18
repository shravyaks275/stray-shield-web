"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import Navbar from "@/components/Navbar"
import { apiCall } from "@/utils/api"
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { motion } from "framer-motion"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("citizen")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ ...formData, userType }),
      })

      localStorage.setItem("token", data.token)
      localStorage.setItem("userType", data.userType)
      localStorage.setItem("userId", data.userId)

      if (data.userType === "ngo") {
        router.push("/ngo-dashboard")
      } else {
        router.push("/report")
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50" />
      
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4 pt-20 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass rounded-[2rem] border border-white/20 shadow-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Welcome Back</h1>
              <p className="text-muted-foreground font-medium">Log in to your Stray Shield account</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </motion.div>
            )}

            {/* User Type Selection */}
            <div className="mb-8">
              <div className="flex p-1 bg-secondary/30 rounded-2xl border border-white/10 backdrop-blur-sm">
                {["citizen", "ngo"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all duration-300 relative ${
                      userType === type ? "text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {userType === type && (
                      <motion.div layoutId="userType" className="absolute inset-0 bg-primary rounded-xl -z-10" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                    )}
                    <span className="relative z-10">{type.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[14px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-foreground text-background rounded-xl font-bold text-lg hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.5)] disabled:opacity-70 disabled:pointer-events-none transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-bold underline decoration-primary/30 underline-offset-4">
                Sign up instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
