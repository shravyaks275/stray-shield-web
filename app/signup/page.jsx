"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import Navbar from "@/components/Navbar"
import { apiCall } from "@/utils/api"
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'

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

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   // 🔒 Temporarily disable signup
//    router.push("/dashboard");
//   setLoading(false);
// };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-border bg-card p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground mb-8">Join Stray Shield and make a difference</p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">I am a:</label>
              <div className="flex gap-4">
                {["citizen", "ngo"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData((prev) => ({ ...prev, userType: type }))}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors capitalize ${
                      formData.userType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-border text-foreground hover:border-blue-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.userType === "ngo" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Organization Name</label>
                    <input
                      type="text"
                      name="ngo_organizationName"
                      value={ngoData.organizationName}
                      onChange={handleChange}
                      placeholder="NGO name"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Registration Number</label>
                    <input
                      type="text"
                      name="ngo_registrationNumber"
                      value={ngoData.registrationNumber}
                      onChange={handleChange}
                      placeholder="NGO registration number"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
                    <input
                      type="text"
                      name="ngo_address"
                      value={ngoData.address}
                      onChange={handleChange}
                      placeholder="Organization address"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="91+ 1234567890"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}