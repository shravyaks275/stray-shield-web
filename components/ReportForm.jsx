"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createReport, apiCall } from "@/utils/api"
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

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
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [aiStatuses, setAiStatuses] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImages(prev => [...prev, ...files])

      const readers = files.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then(newPreviews => {
        setImagePreviews(prev => [...prev, ...newPreviews])
      })
    }
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove))
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

      // Step 1: Call backend AI classifier for each image
      if (imagePreviews.length > 0) {
        for (const preview of imagePreviews) {
          const base64Image = preview.split(",")[1]
          const res = await apiCall("/api/classify", {
            method: "POST",
            body: JSON.stringify({ imageBuffer: base64Image }),
          })
          aiResults.push(res.label || "Unknown")
        }
        setAiStatuses(aiResults)
      }

      // Step 2: Build report payload
      const reportData = {
        ...formData,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        images: imagePreviews,
        imageUrl: imagePreviews[0] || undefined,
        aiStatuses: aiResults,
      }

      // Step 3: Save report via backend
      await createReport(reportData)

      // Step 3.5: Save to LocalStorage for immediate display in My Reports
      const newReportEntry = {
        ...reportData,
        id: Date.now(),
        userId: localStorage.getItem("userId"),
        status: "pending",
        timestamp: new Date().toISOString(),
        title: `Reported dog at ${formData.location || "Unknown area"}`,
        aiStatus: aiResults.length > 0 ? aiResults[0] : "Pending Review",
      }
      const existingReports = JSON.parse(localStorage.getItem("stray_reports_data") || "[]")
      localStorage.setItem("stray_reports_data", JSON.stringify([newReportEntry, ...existingReports]))

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
        router.push("/my-reports")
      }, 2000)
    } catch (err) {
      setError(err.message || "Failed to submit report. Please try again.")
      console.error('[v0] Report submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
  const labelClasses = "text-sm font-bold text-foreground block mb-2"

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      onSubmit={handleSubmit}
      className="glass-panel rounded-[2rem] border border-white/20 p-8 sm:p-10 space-y-8 shadow-2xl max-w-3xl mx-auto relative z-10"
    >
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700 font-medium">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reporter Details */}
      <div className="space-y-6">
        <div className="pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground tracking-tight">Reporter Details</h3>
          <p className="text-sm text-muted-foreground">We need your contact info in case we have questions.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Your Name</label>
            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Full name" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Phone Number <span className="text-primary ml-1">*</span></label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+91 1234567890" required className={inputClasses} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Email</label>
            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="you@email.com" className={inputClasses} />
          </div>
        </div>
      </div>

      {/* Incident Details */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground tracking-tight">Incident Details</h3>
          <p className="text-sm text-muted-foreground">Describe where the dog is and its condition.</p>
        </div>

        <div>
          <label className={labelClasses}>Exact Location <span className="text-primary ml-1">*</span></label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Near Central Park entrance, Main Street" required className={inputClasses} />
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the dog's appearance, collar details, or any visible injuries..." className={`${inputClasses} resize-none`} />
        </div>

        {/* Image Upload */}
        <div>
          <label className={labelClasses}>Photos of the Dog</label>
          <div className="border-2 border-dashed border-border/60 hover:border-primary/50 bg-background/30 rounded-2xl p-6 transition-colors">
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" id="image-input" />
            {imagePreviews.length > 0 ? (
              <div className="space-y-6">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {imagePreviews.map((src, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 shadow-sm"
                      >
                        <img src={src} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                            className="p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex justify-center">
                  <label htmlFor="image-input" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full text-sm font-bold text-foreground transition-colors border border-border/50">
                    <Upload className="w-4 h-4" />
                    Add More Photos
                  </label>
                </div>
              </div>
            ) : (
              <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-3 text-muted-foreground w-full py-8">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary/80" />
                </div>
                <p className="font-bold text-foreground">Click to upload images</p>
                <p className="text-xs font-medium opacity-70">PNG, JPG, GIF up to 5MB each</p>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* AI Statuses */}
      {aiStatuses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
          {aiStatuses.map((status, idx) => (
            <p key={idx} className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
              Image {idx + 1} AI Assessment: <span className="opacity-80 font-medium ml-2">{status}</span>
            </p>
          ))}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-foreground text-background font-bold text-lg rounded-xl shadow-lg hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.5)] disabled:opacity-70 disabled:pointer-events-none transition-all mt-4"
      >
        {loading ? "Submitting Report..." : "Submit Report"}
      </motion.button>
    </motion.form>
  )
}
