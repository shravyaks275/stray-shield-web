"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, User, Calendar, Activity } from 'lucide-react'
import { motion } from "framer-motion"

export default function ReportCard({ report, onUpdateStatus, isCitizen = false }) {
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      await onUpdateStatus(report.id, newStatus)
    } finally {
      setUpdating(false)
    }
  }

  const statusColors = {
    pending: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    in_progress: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    resolved: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
  }

  const statusOptions = ["pending", "in_progress", "resolved"]

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-[1.5rem] border border-white/20 p-6 space-y-5 shadow-lg group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Header and Status */}
      <div className="flex justify-between items-start">
        <div
          className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-bold capitalize tracking-wide shadow-sm ${
            statusColors[report.status] || statusColors.pending
          }`}
        >
          {report.status.replace("_", " ")}
        </div>
        {report.createdAt && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(report.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Image */}
      {(report.imageUrl || (report.imageUrls && report.imageUrls[0])) && (
        <div className="aspect-video bg-muted rounded-2xl overflow-hidden shadow-inner relative group-hover:shadow-md transition-shadow">
          <img
            src={report.imageUrl || report.imageUrls?.[0] || "/placeholder.svg"}
            alt="Report"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      {/* Location */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-xl mt-0.5">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
        </div>
        <div>
          <p className="font-bold text-foreground text-lg tracking-tight leading-tight">{report.location}</p>
          {report.latitude && report.longitude && !isNaN(Number(report.latitude)) && !isNaN(Number(report.longitude)) && (
            <p className="text-xs font-mono text-muted-foreground mt-1">
              LAT: {Number(report.latitude).toFixed(4)}, LNG: {Number(report.longitude).toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-background/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
        <p className="text-foreground/90 text-sm leading-relaxed font-medium">{report.description}</p>
      </div>

      {/* AI Health Status */}
      {(report.aiStatus || (report.aiStatuses && report.aiStatuses.length > 0)) && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
            AI Assessment: {report.aiStatus || report.aiStatuses?.[0] || "Pending Review"}
          </span>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-3 pt-5 border-t border-border/40">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Reporter Details</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {report.contactName && (
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-secondary/60 rounded-lg"><User className="w-3.5 h-3.5 text-foreground" /></div>
              <span className="text-sm font-medium text-foreground truncate">{report.contactName}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-secondary/60 rounded-lg"><Phone className="w-3.5 h-3.5 text-foreground" /></div>
            <a
              href={`tel:${report.contactPhone}`}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {report.contactPhone}
            </a>
          </div>
          {report.contactEmail && (
            <div className="flex items-center gap-2.5 sm:col-span-2">
              <div className="p-1.5 bg-secondary/60 rounded-lg"><Mail className="w-3.5 h-3.5 text-foreground" /></div>
              <a
                href={`mailto:${report.contactEmail}`}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors truncate"
              >
                {report.contactEmail}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Buttons or Outcome Label */}
      <div className="flex gap-2.5 pt-5 border-t border-border/40">
        {isCitizen ? (
          <div className="w-full flex items-center justify-center p-3 rounded-xl bg-secondary/50 border border-white/10 text-sm font-bold text-foreground capitalize">
            Current Status: {report.status.replace("_", " ")}
          </div>
        ) : report.status === "pending" ? (
          statusOptions.map((status) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={updating || report.status === status}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all capitalize shadow-sm disabled:opacity-50 disabled:pointer-events-none ${
                report.status === status
                  ? "bg-foreground text-background shadow-md border-transparent"
                  : "bg-background/60 backdrop-blur-sm text-foreground border border-border/60 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {status.replace("_", " ")}
            </motion.button>
          ))
        ) : (
          <div className="w-full flex items-center justify-center p-3 rounded-xl bg-secondary/50 border border-white/10 text-sm font-bold text-foreground capitalize">
            Outcome Selected: {report.status.replace("_", " ")} ✅
          </div>
        )}
      </div>
    </motion.div>
  )
}