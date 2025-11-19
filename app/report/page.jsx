"use client"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import ReportForm from "@/components/ReportForm"

export default function Report() {
  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="mb-5">
            <h1 className="text-4xl font-bold text-foreground mb-2">Report a Stray Dog</h1>
            <p className="text-muted-foreground">Help us locate and care for stray dogs in your community. Fill out the form below with as much detail as possible.</p>
          </div>
          <ReportForm />
        </div>
      </div>
    </ProtectedRoute>
  )
}
