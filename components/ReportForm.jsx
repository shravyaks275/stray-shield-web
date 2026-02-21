"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createReport } from "@/utils/api"
import { AlertCircle, CheckCircle, Upload } from 'lucide-react'

export default function ReportForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  })
  const [images, setImages] = useState([])              // ✅ multiple files
  const [imagePreviews, setImagePreviews] = useState([]) // ✅ multiple previews
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [aiStatuses, setAiStatuses] = useState([])       // ✅ multiple AI results

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImages(files)

      // Generate previews for all files
      const readers = files.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then(setImagePreviews)
    }
  }

  const validateForm = () => {
    if (!formData.location || !formData.contactPhone) {
      setError("Please fill in all required fields")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")
    setSuccess("")
    setAiStatuses([])

    try {
      let aiResults = []

      // 🔎 Step 1: Call AI classifier for each image
      if (imagePreviews.length > 0) {
        for (const preview of imagePreviews) {
          const base64Image = preview.split(",")[1] // remove data:image/jpeg;base64,
          const res = await fetch("/api/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBuffer: base64Image }),
          })
          const data = await res.json()
          aiResults.push(data.label || "Unknown")
        }
        setAiStatuses(aiResults)
      }

      // 🔎 Step 2: Build report payload
      const reportData = {
        ...formData,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        images: imagePreviews,   // ✅ array of base64 previews
        aiStatuses: aiResults,   // ✅ array of AI results
      }

      // 🔎 Step 3: Save report via backend
      await createReport(reportData)

      setSuccess("Report submitted successfully! Thank you for helping.")
      setFormData({
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
      })
      setImages([])
      setImagePreviews([])
      setAiStatuses([])

      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to submit report. Please try again.")
      console.error('[v0] Report submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-8 space-y-6 shadow-sm max-w-3xl mx-auto"
    >
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Report a Stray Dog</h2>
        <p className="text-sm text-muted-foreground">Provide details and photos.</p>
      </div>

      {/* CONTACT + LOCATION */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-2 block">Your Name</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Phone Number <span className="text-xs text-muted-foreground">*</span>
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="91+ 1234567890"
            required
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-2 block">Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="you@email.com"
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Location <span className="text-xs text-muted-foreground">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Near Central Park, Main Street"
            required
            className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe the dog's appearance and condition..."
          className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div>
        <label className="text-sm font-medium mb-2 block">Upload Images</label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple   // ✅ allow multiple uploads
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input" className="cursor-pointer">
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-8 h-8 text-blue-500" />
                <p>Click to upload images</p>
                <p className="text-xs">PNG, JPG, GIF up to 10MB each</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* AI Status Preview */}
      {aiStatuses.length > 0 && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
          {aiStatuses.map((status, idx) => (
            <p key={idx} className="text-sm text-blue-700">
              Image {idx + 1}: AI Health Status → {status}
            </p>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Submitting Report..." : "Submit Report"}
      </button>
    </form>
  )
}
