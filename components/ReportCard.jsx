"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, User, Calendar, Activity } from 'lucide-react'

export default function ReportCard({ report, onUpdateStatus }) {
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
    pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
    in_progress: "bg-blue-50 border-blue-200 text-blue-700",
    resolved: "bg-green-50 border-green-200 text-green-700",
  }

  const statusOptions = ["pending", "in_progress", "resolved"]

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4 hover:shadow-lg transition-shadow">
      {/* Status Badge */}
      <div
        className={`inline-block px-3 py-1 rounded-full border text-sm font-medium capitalize ${
          statusColors[report.status] || statusColors.pending
        }`}
      >
        {report.status.replace("_", " ")}
      </div>

      {/* Image */}
      {report.imageUrl && (
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={report.imageUrl || "/placeholder.svg"}
            alt="Report"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Location */}
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-foreground">{report.location}</p>
          {report.latitude && report.longitude && (
            <p className="text-sm text-muted-foreground">
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-foreground text-sm">{report.description}</p>
      </div>

      {/* AI Health Status */}
      {report.aiStatus && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            AI Health Status: {report.aiStatus}
          </span>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-2 border-t border-border pt-4">
        {report.contactName && (
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{report.contactName}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <a
            href={`tel:${report.contactPhone}`}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {report.contactPhone}
          </a>
        </div>
        {report.contactEmail && (
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href={`mailto:${report.contactEmail}`}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {report.contactEmail}
            </a>
          </div>
        )}
      </div>

      {/* Timestamp */}
      {report.createdAt && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
          <Calendar className="w-4 h-4" />
          {new Date(report.createdAt).toLocaleDateString()}
        </div>
      )}

      {/* Status Update Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={updating || report.status === status}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize disabled:opacity-50 disabled:cursor-not-allowed ${
              report.status === status
                ? "bg-blue-500 text-white"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  )
}