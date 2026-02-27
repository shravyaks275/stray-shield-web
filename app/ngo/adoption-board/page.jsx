"use client";

"use client"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import AdoptionBoard from "@/components/AdoptionDashboard"

export default function AdoptionBoardPage() {
  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="mb-5">
            <h1 className="text-4xl font-bold text-foreground m-1">Adoption Board</h1>
            <p className="text-muted-foreground m-1">
              View and manage stray dogs available for adoption.
            </p>
          </div>
          <AdoptionBoard />
        </div>
      </div>
    </ProtectedRoute>
  )
}