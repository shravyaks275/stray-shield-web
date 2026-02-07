"use client"

import { useEffect, useState } from "react"
import ReportCard from "./ReportCard"   // assuming ReportCard is in the same folder
import { getMyReports, updateReportStatus } from "@/utils/api"
import { AlertCircle } from "lucide-react"

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMyReports() // backend endpoint: GET /api/reports/my
        setReports(data)
      } catch (err) {
        setError("Failed to load reports. Please try again.")
        console.error("[v0] MyReports fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  // Handle status update
  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus) // backend endpoint: PATCH /api/reports/:id
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status: newStatus } : r
        )
      )
    } catch (err) {
      setError("Failed to update status. Please try again.")
      console.error("[v0] Status update error:", err)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
     
      {error && (
        <div className="p-1 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-muted-foreground">No reports submitted yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}