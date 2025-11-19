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
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    if (!formData.location || !formData.description || !formData.contactPhone) {
      setError("Please fill in all required fields")
      return false
    }
    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters")
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
      const reportData = {
        location: formData.location,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        description: formData.description,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        imageUrl: imagePreview || undefined,
      }

      const result = await createReport(reportData)

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
      setImage(null)
      setImagePreview("")

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
        <p className="text-sm text-muted-foreground">Provide details and a photo.</p>
      </div>

      {/* CONTACT + LOCATION (2 COLUMNS) */}
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
        <label className="text-sm font-medium mb-2 block">
          Description <span className="text-xs text-muted-foreground">*</span>
        </label>
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
        <label className="text-sm font-medium mb-2 block">Upload Image</label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-input" />
          <label htmlFor="image-input" className="cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-8 h-8 text-blue-500" />
                <p>Click to upload image</p>
                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </label>
        </div>
      </div>

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
