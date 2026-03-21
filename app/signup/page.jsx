"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import Navbar from "@/components/Navbar"
import { apiCall } from "@/utils/api"
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "citizen",
  })
  const [ngoData, setNgoData] = useState({
    organizationName: "",
    registrationNumber: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("ngo_")) {
      setNgoData((prev) => ({
        ...prev,
        [name.replace("ngo_", "")]: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    setError("")
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (formData.userType === "ngo" && !ngoData.organizationName) {
      setError("Please fill in all NGO details")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: formData.userType,
      }

      if (formData.userType === "ngo") {
        payload.organizationName = ngoData.organizationName
        payload.registrationNumber = ngoData.registrationNumber
        payload.address = ngoData.address
      }

      const data = await apiCall("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      setSuccess("Account created successfully! Redirecting...")
      localStorage.setItem("token", data.token)
      localStorage.setItem("userType", data.userType)
      localStorage.setItem("userId", data.userId)

      setTimeout(() => {
        router.push(data.userType === "ngo" ? "/ngo-dashboard" : "/report")
      }, 1500)
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
  const labelClasses = "text-sm font-bold text-foreground block"

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50" />
      
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass rounded-[2rem] border border-white/20 shadow-2xl p-8 sm:p-10 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Create Account</h1>
              <p className="text-muted-foreground font-medium">Join Stray Shield and make a difference</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-700 font-medium">{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Type Selection */}
            <div className="mb-8">
              <div className="flex p-1 bg-secondary/30 rounded-2xl border border-white/10 backdrop-blur-sm">
                {["citizen", "ngo"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData((prev) => ({ ...prev, userType: type }))}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl capitalize transition-all duration-300 relative ${
                      formData.userType === type ? "text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {formData.userType === type && (
                      <motion.div layoutId="signupUserType" className="absolute inset-0 bg-primary rounded-xl -z-10" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                    )}
                    <span className="relative z-10">{type.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className={labelClasses}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className={inputClasses}
                />
              </div>

              <AnimatePresence>
                {formData.userType === "ngo" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5 overflow-hidden"
                  >
                    <div className="space-y-1.5 pt-2">
                      <label className={labelClasses}>Organization Name</label>
                      <input
                        type="text"
                        name="ngo_organizationName"
                        value={ngoData.organizationName}
                        onChange={handleChange}
                        placeholder="NGO name"
                        required
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClasses}>Registration Number</label>
                      <input
                        type="text"
                        name="ngo_registrationNumber"
                        value={ngoData.registrationNumber}
                        onChange={handleChange}
                        placeholder="NGO registration number"
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClasses}>Address</label>
                      <input
                        type="text"
                        name="ngo_address"
                        value={ngoData.address}
                        onChange={handleChange}
                        placeholder="Organization address"
                        className={inputClasses}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className={labelClasses}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClasses}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className={inputClasses}
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

              <div className="space-y-1.5">
                <label className={labelClasses}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={inputClasses}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-foreground text-background rounded-xl font-bold text-lg hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.5)] disabled:opacity-70 disabled:pointer-events-none transition-all"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-bold underline decoration-primary/30 underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}