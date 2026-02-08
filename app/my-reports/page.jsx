"use client"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import MyReports from "@/components/MyReports"

export default function MyReportsPage() {
  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="mb-5">
            <h1 className="text-4xl font-bold text-foreground m-1">My Reports</h1>
            <p className="text-muted-foreground m-1">
              View and track the status of stray dog reports you’ve submitted.
            </p>
          </div>
          <MyReports />
        </div>
      </div>
    </ProtectedRoute>
  )
}