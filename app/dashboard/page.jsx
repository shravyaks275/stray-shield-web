"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import ReportCard from "@/components/ReportCard"
import { getReports, updateReportStatus } from "@/utils/api"
import { AlertCircle, RefreshCw, BarChart3, Clock, CheckCircle, Play } from 'lucide-react'

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    fetchReports()
  }, [filter])

  const fetchReports = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getReports(filter)
      setReports(data.reports || [])
      calculateStats(data.reports || [])
    } catch (err) {
      console.error('[v0] Fetch error:', err)
      setError(err.message || "Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reportList) => {
    const allReports = reportList.length > 0 ? reportList : reports
    setStats({
      total: allReports.length,
      pending: allReports.filter(r => r.status === 'pending').length,
      inProgress: allReports.filter(r => r.status === 'in_progress').length,
      resolved: allReports.filter(r => r.status === 'resolved').length,
    })
  }

  const handleUpdateReport = async (reportId, status) => {
    try {
      await updateReportStatus(reportId, status)
      fetchReports()
    } catch (err) {
      setError("Failed to update report")
      console.error('[v0] Update error:', err)
    }
  }

  const filteredReports = filter === "all" ? reports : reports.filter((r) => r.status === filter)

  return (
    <ProtectedRoute userType="ngo">
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">NGO Dashboard</h1>
            <p className="text-muted-foreground">Manage stray dog reports and coordinate rescue efforts</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<BarChart3 className="w-6 h-6" />}
              label="Total Reports"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Pending"
              value={stats.pending}
              color="yellow"
            />
            <StatCard
              icon={<Play className="w-6 h-6" />}
              label="In Progress"
              value={stats.inProgress}
              color="blue"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              label="Resolved"
              value={stats.resolved}
              color="green"
            />
          </div>

          {/* Filter and Refresh Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "in_progress", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg border transition-colors capitalize text-sm font-medium ${
                    filter === status
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-border text-foreground hover:border-blue-300"
                  }`}
                >
                  {status === "in_progress" ? "In Progress" : status}
                </button>
              ))}
            </div>
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              <p className="text-muted-foreground mt-4">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-lg bg-card">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No reports found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {filter !== "all" ? "Try changing the filter" : "Reports will appear here once citizens submit them"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    onUpdateStatus={handleUpdateReport} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Statistics Card Component
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  }

  return (
    <div className={`rounded-lg border p-6 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
    </div>
  )
}
