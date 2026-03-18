"use client";

import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import AdoptionBoard from "@/components/AdoptionDashboard"
import { motion } from "framer-motion"

export default function AdoptionBoardPage() {
  return (
    <ProtectedRoute userType="ngo">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background Glows matching primary.main and secondary.main */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        
        <Navbar />
        
        {/* pt-36 ensures we easily clear the h-24 navbar + extra breathing room */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
          <div className="mb-12 text-center sm:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 tracking-tight"
            >
              Adoption <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Board</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-medium max-w-2xl"
            >
              View and manage stray dogs available for adoption. Review interested applicants and finalize placements.
            </motion.p>
          </div>
          
          <AdoptionBoard />
        </main>
      </div>
    </ProtectedRoute>
  )
}