"use client"
import Navbar from "@/components/Navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import ReportForm from "@/components/ReportForm"
import { motion } from "framer-motion"

export default function Report() {
  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="mb-10 text-center sm:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl sm:text-5xl font-black text-foreground mb-3 tracking-tight"
            >
              Report a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Stray Dog</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-medium max-w-2xl"
            >
              Help us locate and care for stray dogs in your community. Fill out the form below with as much detail as possible.
            </motion.p>
          </div>
          <ReportForm />
        </main>
      </div>
    </ProtectedRoute>
  )
}
