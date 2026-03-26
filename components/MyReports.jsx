"use client"

import { useEffect, useState } from "react"
import ReportCard from "./ReportCard"
import { getMyReports, updateReportStatus } from "@/utils/api"
import { AlertCircle, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    setError("")
    try {
      // 🔒 Backend disabled — using mock data for UI demo
      // const data = await getMyReports() 
      
      let mockReports = [
        {
          id: 1,
          title: "Injured dog near market",
          description: "A stray dog with a limp spotted near Anekal market.",
          status: "pending",
          location: "Anekal Market",
          timestamp: "2025-11-19T10:30:00Z",
          aiStatus: "Possible Injury",
        },
      ];

      if (typeof window !== "undefined") {
        const local = localStorage.getItem("stray_reports_data");
        if (local) {
          const parsed = JSON.parse(local);
          mockReports = [...parsed, ...mockReports];
        }
      }

      setReports(mockReports)
    } catch (err) {
      setError("Failed to load reports. Please try again.")
      console.error("[v0] MyReports fetch error:", err)
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus)
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
    <div className="w-full">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading your reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-[2rem] border border-white/20">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No reports submitted</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't submitted any stray dog reports yet. When you do, they will appear here.
          </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {reports.map((report) => (
            <motion.div key={report.id} variants={itemVariants}>
              <ReportCard
                report={report}
                onUpdateStatus={handleUpdateStatus}
                isCitizen={true}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
