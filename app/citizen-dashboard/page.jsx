"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import DogCard from "@/components/DogCard"; 
import { motion } from "framer-motion";

// ✅ user preferences
const userPreferences = {
  lifestyle: "active",
  household: "single",
  experience: "beginner",
  space: "apartment",
};


export default function CitizenDashboard() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    setLoading(true);

    // 🔒 Backend disabled — using mock data
    const mockDogs = [
      {
        id: 1,
        sex: "Female",
        name: "Zoe",
        age: "1 year",
        breed: "Indie",
        status: "Available",
        location: "Indiranagar",
        images: ["/images/zoe_1.jpg", "/images/zoe_2.jpg", "/images/zoe_3.jpg"],
        traits: { energy: "high", sociability: "friendly", trainability: "easy" },
      },
      {
        id: 2,
        sex: "Male",
        name: "Pogo",
        age: "3 years",
        breed: "Indie",
        status: "Available",
        location: "Jigani",
        images: ["/images/pogo_1.jpg", "/images/pogo_2.jpg", "/images/pogo_3.jpg"],
        traits: { energy: "medium", sociability: "shy" }
      },
      {
        id: 3,
        sex: "Male",
        name: "Milo",
        age: "2 years",
        breed: "Indie",
        status: "Available",
        location: "Kudlu Gate",
        images: ["/images/milo_1.jpg", "/images/milo_2.jpg"],
        traits: { energy: "low", sociability: "friendly" }
      },
      {
        id: 4,
        sex: "Male",
        name: "Charlie",
        age: "3 years",
        breed: "Indie",
        status: "Available",
        location: "Vijaynagar",
        images: ["/images/charlie.jpg"],
        traits: { energy: "medium", sociability: "shy" }
      },
      {
        id: 5,
        sex: "Male",
        name: "Max",
        age: "4 years",
        breed: "Indie",
        status: "Available",
        location: "Jigani",
        images: ["/images/max.jpg"],
        traits: { energy: "high", sociability: "friendly" }
      },
      {
        id: 6,
        sex: "Female",
        name: "Bella",
        age: "8 months",
        breed: "Indie",
        status: "Available",
        location: "Hosa Road",
        images: ["/images/bella.jpg"],
        traits: { energy: "medium", sociability: "shy" }
      },
      {
        id: 7,
        sex: "Male",
        name: "Buddy",
        age: "2 years",
        breed: "Indie",
        status: "Available",
        location: "Anekal",
        images: ["/images/buddy.jpeg"],
        traits: { energy: "low", sociability: "friendly" }
      },
      {
        id: 8,
        sex: "Female",
        name: "Maya",
        age: "1 year",
        breed: "Indie",
        status: "Available",
        location: "E-city",
        images: ["/images/maya_1.jpg"],
        traits: { energy: "high", sociability: "shy" }
      },
      {
        id: 9,
        sex: "Male",
        name: "Coco",
        age: "4 Months",
        breed: "Indie",
        status: "Available",
        location: "Hebbal",
        images: ["/images/coco.jpeg"],
        traits: { energy: "medium", sociability: "friendly" }
      },
    ];

    setDogs(mockDogs);
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="mb-10 text-center sm:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl sm:text-5xl font-black text-foreground mb-3 tracking-tight"
            >
              Adopt a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Street Dog</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-medium max-w-2xl"
            >
              Give a stray a loving home. Browse our adoption board to find the perfect companion tailored to your lifestyle.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">Loading amazing dogs...</p>
            </div>
          ) : dogs.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-[2rem] border border-white/20">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🐕</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No up-to-date listings</h2>
              <p className="text-muted-foreground">Check back later for new companions available for adoption.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            >
              {dogs.map((dog) => (
                <motion.div key={dog.id} variants={itemVariants}>
                  <DogCard dog={dog} user={userPreferences}/>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}