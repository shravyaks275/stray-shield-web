"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { createReport, apiCall } from "@/utils/api"
import { AlertCircle, CheckCircle, Upload, X, MapPin, Camera, Video } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

// Compress image to max 500KB and resize to smaller dimensions
async function compressImage(base64String) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      const maxWidth = 800
      const maxHeight = 600

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      let quality = 0.8
      let compressed = canvas.toDataURL('image/jpeg', quality)

      while (compressed.length > 500000 && quality > 0.1) {
        quality -= 0.1
        compressed = canvas.toDataURL('image/jpeg', quality)
      }

      resolve(compressed)
    }
    img.src = base64String
  })
}

export default function ReportForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    contactName: "",
    contactPhone: "",
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [aiStatuses, setAiStatuses] = useState([])
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Auto-get geolocation on component mount
  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser")
      return
    }

    setGeoLoading(true)
    setGeoError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        }))
        setGeoLoading(false)
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location denied. Please enable location access or enter manually.")
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError("Location unavailable. Please enter location manually.")
        } else {
          setGeoError("Unable to get location. Please enter manually.")
        }
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const MAX_IMAGES = 3
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB per file

    // Validate file count
    if (imagePreviews.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. You already have ${imagePreviews.length}.`)
      return
    }

    // Validate file sizes
    const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setError(`File size too large. Max ${5}MB per image. Please select smaller images.`)
      return
    }

    if (files.length > 0) {
      setImages(prev => [...prev, ...files])
      setError("")

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
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Camera functions for laptop webcam access
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
    } catch (err) {
      console.error('Camera error:', err)
      // Fallback to file input
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setImagePreviews(prev => [...prev, dataUrl])
      closeCamera()
    }
  }

  const validateForm = () => {
    if (!formData.location || !formData.contactPhone) {
      setError("Please fill in location and phone number")
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

      // Step 1: Compress and classify each image
      if (imagePreviews.length > 0) {
        for (let i = 0; i < imagePreviews.length; i++) {
          try {
            const preview = imagePreviews[i]
            const base64Image = preview.split(",")[1]
            
            // Compress image before classification
            const compressedImage = await compressImage(preview)
            const compressedBase64 = compressedImage.split(",")[1]
            
            const res = await apiCall("/api/classify", {
              method: "POST",
              body: JSON.stringify({ imageBuffer: compressedBase64 }),
            })
            aiResults.push(res.label || res.message || "Unknown")
          } catch (classifyErr) {
            console.warn("Image classification failed, using fallback:", classifyErr)
            aiResults.push("Pending Review")
          }
        }
        setAiStatuses(aiResults)
      }

      // Step 2: Build minimal report payload (NO full image data - only count & metadata)
      const reportData = {
        ...formData,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        imageCount: imagePreviews.length,
        imageUrl: imagePreviews.length > 0 ? imagePreviews[0] : null,
        imageUrls: imagePreviews.length > 0 ? [imagePreviews[0]] : [],
        aiStatus: aiResults.length > 0 ? aiResults[0] : "Pending Review",
        aiStatuses: aiResults,
        title: `Reported dog at ${formData.location || "Unknown"}`,
      }

      // Step 3: Save report (createReport handles localStorage saving)
      await createReport(reportData)

      setSuccess("Report submitted successfully! Thank you for helping.")
      setFormData({
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        contactName: "",
        contactPhone: "",
      })
      setImages([])
      setImagePreviews([])
      setAiStatuses([])

      // Show confirmation briefly and then navigate to My Reports.
      setTimeout(() => {
        router.push("/my-reports")
      }, 800)
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
        </div>
      </div>

      {/* Incident Details */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-foreground tracking-tight">Incident Details</h3>
          <p className="text-sm text-muted-foreground">Describe where the dog is and its condition.</p>
        </div>

        {/* Auto Geolocation */}
        <div>
          <label className={labelClasses}>Location <span className="text-primary ml-1">*</span></label>
          <div className="flex gap-3">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Auto-detected or enter manually"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={geoLoading}
              className="px-4 py-3.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50 flex items-center gap-2"
              title="Get current location"
            >
              <MapPin className="w-5 h-5" />
              {geoLoading && <span className="text-xs">...</span>}
            </button>
          </div>
          {geoError && <p className="text-xs text-destructive mt-2">{geoError}</p>}
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the dog's appearance, collar details, or any visible injuries..." className={`${inputClasses} resize-none`} />
        </div>

        {/* Image Upload with Camera Option */}
        <div>
          <label className={labelClasses}>Photos of the Dog</label>
          <div className="border-2 border-dashed border-border/60 hover:border-primary/50 bg-background/30 rounded-2xl p-6 transition-colors">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-input"
              ref={fileInputRef}
            />
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
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={openCamera}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-full text-sm font-bold text-foreground transition-colors border border-primary/50"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </button>
                  <label htmlFor="image-input" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full text-sm font-bold text-foreground transition-colors border border-border/50">
                    <Upload className="w-4 h-4" />
                    Upload
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground w-full py-8">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={openCamera}
                    className="cursor-pointer flex flex-col items-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
                  >
                    <Camera className="w-8 h-8 text-primary/80" />
                    <p className="text-xs font-bold text-foreground">Camera</p>
                  </button>
                  <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-2 p-4 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors">
                    <Upload className="w-8 h-8 text-primary/80" />
                    <p className="text-xs font-bold text-foreground">Upload</p>
                  </label>
                </div>
                <p className="font-bold text-foreground">Add a photo of the dog</p>
                <p className="text-xs font-medium opacity-70">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="max-w-full max-h-[70vh] rounded-xl"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-3 bg-primary text-white font-bold rounded-full flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="px-6 py-3 bg-secondary text-foreground font-bold rounded-full"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

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
