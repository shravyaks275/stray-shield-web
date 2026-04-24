"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import ReportCard from "@/components/ReportCard"
import { getReports, updateReportStatus } from "@/utils/api"
import { AlertCircle, RefreshCw, BarChart3, Clock, CheckCircle, Play } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function NgoDashboard() {
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
  }, []) // Remove filter dependency

  // dummy report without api
  const fetchReports = async () => {
    setLoading(true);
    setError("");

    // Load local reports from browser storage (citizen submissions)
    let localReports = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("stray_reports_data");
      if (stored) {
        try {
          localReports = JSON.parse(stored);
        } catch (err) {
          console.warn("Failed to parse stray_reports_data for NGO dashboard:", err);
          localReports = [];
        }
      }
    }

    // 🔒 Backend disabled — using mock data
    const mockReports = [
      {
        id: 1,
        title: "Injured dog near market",
        description: "A stray dog with a limp spotted near Madivala market.",
        status: "pending",
        location: "Madivala Market",
        timestamp: "2025-11-19T10:30:00Z",
        aiStatus: "Possible Injury",
        contactName: "Rohan K",
        contactPhone: "9876543210"
      },
      {
        id: 2,
        title: "Puppies stuck in drain",
        description: "Three puppies trapped in a storm drain near the bus stand.",
        status: "in_progress",
        location: "Anekal Bus Stand",
        timestamp: "2025-11-18T14:15:00Z",
        aiStatus: "Urgent Rescue",
        contactPhone: "9988776655"
      },
      {
        id: 3,
        title: "Rescue completed",
        description: "Dog rescued and taken to shelter.",
        status: "resolved",
        location: "Koramangala Shelter",
        timestamp: "2025-11-17T09:00:00Z",
        aiStatus: "Safe",
        contactName: "Shelter Staff",
        contactEmail: "staff@stray-shield.org"
      },
    ];

    const mergedReports = [...localReports, ...mockReports];
    setReports(mergedReports);
    calculateStats(mergedReports);
    setTimeout(() => {
      setLoading(false);
    }, 600) // slight delay for visual effect
  };

  const calculateStats = (reportList) => {
    const allReports = reportList.length > 0 ? reportList : reports
    setStats({
      total: allReports.length,
      pending: allReports.filter(r => r.status === 'pending').length,
      inProgress: allReports.filter(r => r.status === 'in_progress').length,
      resolved: allReports.filter(r => r.status === 'resolved').length,
    })
  }

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      // Mock update
      const updatedReports = reports.map((r) =>
        r.id === reportId ? { ...r, status: newStatus } : r
      );
      setReports(updatedReports);
      calculateStats(updatedReports);
    } catch (err) {
      setError("Failed to update status. Please try again.");
      console.error("[v0] API update status error:", err);
    }
  };

  const filteredReports = filter === "all" ? reports : reports.filter((r) => r.status === filter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <ProtectedRoute userType="ngo">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16">
          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-foreground mb-3 tracking-tight"
            >
              NGO <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dashboard</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-medium max-w-2xl"
            >
              Manage stray dog reports, coordinate rescue efforts, and track your organization's impact in the community.
            </motion.p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Total Reports" value={stats.total} color="blue" />
            <StatCard icon={<Clock className="w-6 h-6" />} label="Pending" value={stats.pending} color="yellow" />
            <StatCard icon={<Play className="w-6 h-6" />} label="In Progress" value={stats.inProgress} color="indigo" />
            <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Resolved" value={stats.resolved} color="green" />
          </div>

          {/* Filter and Refresh Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 p-2 bg-background/50 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex p-1 bg-secondary/30 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto hide-scrollbar">
              {["all", "pending", "in_progress", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold rounded-lg capitalize transition-all duration-300 relative whitespace-nowrap ${filter === status ? "text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {filter === status && (
                    <motion.div layoutId="filterPill" className="absolute inset-0 bg-primary rounded-lg -z-10" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                  )}
                  <span className="relative z-10">{status === "in_progress" ? "In Progress" : status}</span>
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-xl hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.5)] transition-all font-bold disabled:opacity-70 w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </motion.button>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">Syncing reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="glass-panel p-16 text-center rounded-[2rem] border border-white/20">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No reports found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {filter !== "all" ? "Try changing the filter to see other reports." : "There are currently no reports submitted by citizens."}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-5 px-1">
                Showing {filteredReports.length} {filter !== "all" && filter.replace("_", " ")} requests
              </p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredReports.map((report) => (
                  <motion.div key={report.id} variants={itemVariants}>
                    <ReportCard report={report} onUpdateStatus={handleUpdateStatus} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

// Statistics Card Component
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass-panel rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden group ${colorMap[color]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">{label}</p>
          <p className="text-4xl font-black text-foreground drop-shadow-sm tracking-tight">{value}</p>
        </div>
        <div className="p-3 bg-background/50 rounded-xl border border-white/10 shadow-sm backdrop-blur-md">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
