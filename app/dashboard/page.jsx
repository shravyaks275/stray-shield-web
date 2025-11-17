"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import ReportCard from "@/components/ReportCard"
import { apiCall } from "@/utils/api"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchReports()
  }, [filter])

  const fetchReports = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await apiCall(`/api/reports?status=${filter}`)
      setReports(data.reports || [])
    } catch (err) {
      setError(err.message || "Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateReport = async (reportId, status) => {
    try {
      await apiCall(`/api/reports/${reportId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
      fetchReports()
    } catch (err) {
      setError("Failed to update report")
    }
  }

  const filteredReports = filter === "all" ? reports : reports.filter((r) => r.status === filter)

  return (
    <ProtectedRoute userType="ngo">
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">NGO Dashboard</h1>
            <p className="text-muted-foreground">Manage stray dog reports from your community</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Filter and Refresh */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2">
              {["all", "pending", "in_progress", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                    filter === status
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-border text-foreground hover:border-blue-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <p className="text-muted-foreground mt-4">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reports found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} onUpdateStatus={handleUpdateReport} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
