"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, User, Calendar, Activity, BrainCircuit, Globe } from 'lucide-react'
import { motion } from "framer-motion"
import { getNgoByName } from '@/config/ngoData'

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

  const getAiHealthDetails = (statusString) => {
    let label = statusString || "";
    let confidence = 0;

    if (label.includes('|')) {
      const parts = label.split('|');
      label = parts[0];
      confidence = parseInt(parts[1], 10);
    }

    const status = label.toLowerCase();

    let details = { score: confidence, color: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", label: label || "Assessment Unavailable" };

    if (status.includes("healthy") || status.includes("excellent")) {
      details = { ...details, color: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    }
    else if (status.includes("injured") || status.includes("fracture") || status.includes("wound") || status.includes("bleeding") || status.includes("trauma")) {
      details = { ...details, color: "bg-rose-600", text: "text-rose-700 dark:text-rose-400", bg: "bg-rose-600/10", border: "border-rose-600/20", label: "🚨 " + label };
    }
    else if (status.includes("minor") || status.includes("skin") || status.includes("dental") || status.includes("healing") || status.includes("possible")) {
      details = { ...details, color: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    }
    else if (status.includes("severe") || status.includes("priority") || status.includes("urgent") || status.includes("malnourished") || status.includes("critical")) {
      details = { ...details, color: "bg-red-500", text: "text-red-700 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
    }
    else if (status.includes("pending") || status === "") {
      return { score: 0, color: "bg-slate-400", text: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "AI Analysis Pending" };
    }

    // If no confidence provided by backend (e.g. old reports), assign a default
    if (!details.score) details.score = 85;

    return details;
  }

  const aiDetails = getAiHealthDetails(report.aiStatus || report.aiStatuses?.[0])

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
          className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-bold capitalize tracking-wide shadow-sm ${statusColors[report.status] || statusColors.pending
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

      {/* Reporting Contact Info */}
      {(report.contactName || report.contactPhone || report.contactEmail) && (
        <div className="bg-secondary/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Reporter Contact</p>
          <div className="space-y-1.5">
            {report.contactName && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <User className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-medium">{report.contactName}</span>
              </div>
            )}
            {report.contactPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`tel:${report.contactPhone}`} className="hover:text-primary transition-colors font-mono">
                  {report.contactPhone}
                </a>
              </div>
            )}
            {report.contactEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`mailto:${report.contactEmail}`} className="hover:text-primary transition-colors break-all">
                  {report.contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="bg-background/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
        <p className="text-foreground/90 text-sm leading-relaxed font-medium">{report.description}</p>
      </div>

      {/* AI Health Status */}
      {(report.aiStatus || (report.aiStatuses && report.aiStatuses.length > 0)) && (
        <div className={`p-4 rounded-2xl ${aiDetails.bg} border ${aiDetails.border} backdrop-blur-sm space-y-3`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BrainCircuit className={`w-5 h-5 ${aiDetails.text}`} />
              <span className={`text-sm font-bold ${aiDetails.text}`}>AI Health Assessment</span>
            </div>
            {aiDetails.score > 0 && (
              <div className={`flex flex-col items-end`}>
                <span className={`text-xs font-black ${aiDetails.text} bg-white/20 px-2 py-0.5 rounded-t-md`}>
                  CONFIDENCE
                </span>
                <span className={`text-lg leading-none font-black ${aiDetails.text} bg-white/20 px-2 py-1 rounded-b-md rounded-tl-md`}>
                  {aiDetails.score}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${aiDetails.text} opacity-90`}>{aiDetails.label}</span>
            </div>
            {aiDetails.score > 0 ? (
              <div className="h-2.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aiDetails.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${aiDetails.color} rounded-full`}
                />
              </div>
            ) : (
              <div className="h-2.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/2 bg-slate-400/50 rounded-full absolute"
                />
              </div>
            )}
          </div>
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
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all capitalize shadow-sm disabled:opacity-50 disabled:pointer-events-none ${report.status === status
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