"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import ReportCard from "@/components/ReportCard"
import { getReports, updateReportStatus } from "@/utils/api"
import { AlertCircle, RefreshCw, BarChart3, Clock, CheckCircle, Play, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { getNgoByName } from "@/config/ngoData"

export default function NgoDashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [ngoLocations, setNgoLocations] = useState([])
  const [showMoreOpportunities, setShowMoreOpportunities] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    // Get NGO info and locations
    if (typeof window !== "undefined") {
      let ngoName = localStorage.getItem("ngoName");
      // If no NGO name stored, default to "Stray Shield Official" for testing
      if (!ngoName) {
        ngoName = "Stray Shield Official";
        localStorage.setItem("ngoName", ngoName);
      }
      const ngo = getNgoByName(ngoName);
      if (ngo) {
        setNgoLocations(ngo.location);
      }
    }
    fetchReports()
  }, [])

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
      // Stray Shield Official service areas: Jigani, Anekal
      {
        id: 101,
        title: "Injured dog in Jigani",
        description: "A stray dog with limping found near Jigani market needs immediate care.",
        status: "pending",
        location: "Jigani",
        timestamp: "2025-11-20T10:30:00Z",
        aiStatus: "Injured",
        contactName: "Prakash",
        contactPhone: "9876543220"
      },
      {
        id: 102,
        title: "Puppies rescue in Anekal",
        description: "Three puppies trapped in a drain near Anekal bus station.",
        status: "in_progress",
        location: "Anekal",
        timestamp: "2025-11-19T14:15:00Z",
        aiStatus: "Urgent Rescue",
        contactPhone: "9988776655"
      },
      // Paws & Care Rescue service areas: Indiranagar, Hosa Road
      {
        id: 201,
        title: "Malnourished dog in Indiranagar",
        description: "Stray dog showing signs of malnourishment in Indiranagar colony.",
        status: "pending",
        location: "Indiranagar",
        timestamp: "2025-11-20T09:15:00Z",
        aiStatus: "Malnourished",
        contactName: "Ananya",
        contactPhone: "9876543221"
      },
      {
        id: 202,
        title: "Sick dog at Hosa Road",
        description: "Stray with visible skin condition needs treatment.",
        status: "pending",
        location: "Hosa Road",
        timestamp: "2025-11-18T16:45:00Z",
        aiStatus: "Skin Condition",
        contactName: "Priya M",
        contactPhone: "9876543222"
      },
      // Hope Animal Shelter service areas: Kudlu Gate, E-city
      {
        id: 301,
        title: "Injured dog at Kudlu Gate",
        description: "Dog with serious injury needs immediate medical attention.",
        status: "pending",
        location: "Kudlu Gate",
        timestamp: "2025-11-20T11:00:00Z",
        aiStatus: "Severe Injury",
        contactName: "Rajesh K",
        contactPhone: "9876543223"
      },
      {
        id: 302,
        title: "Stray family in E-city",
        description: "Mother dog with two pups found near E-city tech park.",
        status: "in_progress",
        location: "E-city",
        timestamp: "2025-11-19T13:30:00Z",
        aiStatus: "Family Rescue",
        contactName: "Deepak R",
        contactPhone: "9876543224"
      },
      // City Pet Rescue service area: Vijaynagar
      {
        id: 401,
        title: "Healthy dog in Vijaynagar",
        description: "Stray dog in good health, candidate for adoption.",
        status: "pending",
        location: "Vijaynagar",
        timestamp: "2025-11-20T08:20:00Z",
        aiStatus: "Healthy",
        contactName: "Kumar S",
        contactPhone: "9876543225"
      },
      // Other locations (for "More Opportunities" section)
      {
        id: 501,
        title: "Rescue completed",
        description: "Dog rescued and taken to shelter.",
        status: "resolved",
        location: "Koramangala",
        timestamp: "2025-11-17T09:00:00Z",
        aiStatus: "Safe",
        contactName: "Shelter Staff",
        contactEmail: "staff@stray-shield.org"
      },
      {
        id: 502,
        title: "Injured dog near market",
        description: "A stray dog with severe injuries spotted near Madivala market.",
        status: "pending",
        location: "Madivala",
        timestamp: "2025-11-19T10:30:00Z",
        aiStatus: "Severely Injured",
        contactName: "Rohan K",
        contactPhone: "9876543210"
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

  // Separate reports into local and other locations
  // Use substring matching for more flexible location filtering
  const isLocationMatch = (reportLocation, ngoLocationsList) => {
    return ngoLocationsList.some(ngoLoc =>
      reportLocation.toLowerCase().includes(ngoLoc.toLowerCase()) ||
      ngoLoc.toLowerCase().includes(reportLocation.toLowerCase())
    );
  };

  const localReports = reports.filter(r => isLocationMatch(r.location, ngoLocations));
  const otherLocationReports = reports.filter(r => !isLocationMatch(r.location, ngoLocations));

  // Apply status filter
  const filteredLocalReports = filter === "all" ? localReports : localReports.filter((r) => r.status === filter);
  const filteredOtherReports = filter === "all" ? otherLocationReports : otherLocationReports.filter((r) => r.status === filter);

  const getPriority = (report) => {
    const statusStr = (report.aiStatus || report.aiStatuses?.[0] || "").toLowerCase();
    if (statusStr.includes("severe") || statusStr.includes("priority") || statusStr.includes("urgent") || statusStr.includes("injured") || statusStr.includes("critical")) return 3;
    if (statusStr.includes("minor") || statusStr.includes("skin") || statusStr.includes("dental") || statusStr.includes("healing") || statusStr.includes("possible")) return 2;
    if (statusStr.includes("healthy") || statusStr.includes("excellent") || statusStr.includes("safe")) return 1;
    return 0; // pending or unknown
  }

  const sortedLocalReports = [...filteredLocalReports].sort((a, b) => getPriority(b) - getPriority(a));
  const sortedOtherReports = [...filteredOtherReports].sort((a, b) => getPriority(b) - getPriority(a));

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
        {/* Ambient Background - Optimized GPU Profile */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 opacity-50" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl -z-10 opacity-50" />

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
          ) : sortedLocalReports.length === 0 && sortedOtherReports.length === 0 ? (
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
            <div className="space-y-12">
              {/* Primary - Local Location Reports */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-5 h-5 text-primary" />
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    In Your Service Areas ({sortedLocalReports.length})
                  </p>
                </div>
                {sortedLocalReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="font-medium">No reports in your service areas yet.</p>
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  >
                    {sortedLocalReports.map((report) => (
                      <motion.div key={report.id} variants={itemVariants}>
                        <ReportCard report={report} onUpdateStatus={handleUpdateStatus} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Secondary - Other Location Reports ("More Opportunities") */}
              {sortedOtherReports.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-white/10 pt-12"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full" />
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        More Opportunities ({sortedOtherReports.length})
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMoreOpportunities(!showMoreOpportunities)}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/30 hover:bg-secondary/50 border border-secondary/50 transition-colors"
                    >
                      {showMoreOpportunities ? "Hide" : "Show"} Opportunities
                    </motion.button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">
                    Help expand Stray Shield's impact! You can coordinate with other NGOs or expand your service areas to handle these cases.
                  </p>
                  <AnimatePresence>
                    {showMoreOpportunities && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                        >
                          {sortedOtherReports.map((report) => (
                            <motion.div key={report.id} variants={itemVariants}>
                              <ReportCard report={report} onUpdateStatus={handleUpdateStatus} />
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
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
