"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import DogCard, { calculateMatch } from "@/components/DogCard";
import { motion, AnimatePresence } from "framer-motion";

export default function CitizenDashboard() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userPreferences, setUserPreferences] = useState({
    lifestyle: "active",
    household: "single",
    experience: "beginner",
    space: "apartment",
  });

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
        age: "3 years 4 months",
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
        age: "4 years 6 months",
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
        age: "1 year 2 months",
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

    setDogs(mockDogs.map(d => ({
      ...d,
      healthRecords: [
        { date: "2025-01-15", type: "Vaccination", notes: "Rabies, Core vaccines administered", by: "Ngo Vet", status: "completed" },
        { date: "2025-02-10", type: "Health Check", notes: "General checkup - healthy", by: "City Clinic", status: "cleared" },
        { date: "2024-11-20", type: "Sterilization", notes: "Neutered/Spayed", by: "Rescue Shelter", status: "cleared" }
      ],
      aiHealthCheck: { label: "Normal Case", confidence: "95%" }
    })));
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

  const filteredDogs = filter === "all" 
    ? dogs 
    : dogs.filter(dog => calculateMatch(dog, userPreferences) >= 3);

  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="mb-3 text-center sm:text-left">
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



          {/* New Personality Inputs & Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-2 p-4 bg-secondary/10 border border-white/10 rounded-[2rem] backdrop-blur-md shadow-lg"
          >
            <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">Your Match Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase px-2 mb-2 block">Lifestyle</label>
                <select 
                  value={userPreferences.lifestyle} 
                  onChange={(e) => setUserPreferences({...userPreferences, lifestyle: e.target.value})}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                >
                  <option value="active">Active</option>
                  <option value="moderate">Moderate</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground px-2 uppercase mb-2 block">Household</label>
                <select 
                  value={userPreferences.household} 
                  onChange={(e) => setUserPreferences({...userPreferences, household: e.target.value})}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                >
                  <option value="single">Single</option>
                  <option value="family">Family (Kids)</option>
                  <option value="couple">Couple</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase px-2 mb-2 block">Experience</label>
                <select 
                  value={userPreferences.experience} 
                  onChange={(e) => setUserPreferences({...userPreferences, experience: e.target.value})}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase px-2 mb-2 block">Space</label>
                <select 
                  value={userPreferences.space} 
                  onChange={(e) => setUserPreferences({...userPreferences, space: e.target.value})}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House w/ Yard</option>
                  <option value="farm">Farm / Large Land</option>
                </select>
              </div>
            </div>
            </motion.div>
            <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-3 p-2 lg:p-2 bg-secondary/10 border border-white/10 rounded-[2rem] "
          >
            <div className="flex gap-2 p-1.5 bg-background/50 rounded-2xl border border-white/5 w-fit">
              <button 
                onClick={() => setFilter("all")} 
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${filter === "all" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-foreground text-muted-foreground"}`}
              >
                All Dogs
              </button>
              <button 
                onClick={() => setFilter("for_me")} 
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${filter === "for_me" ? "bg-primary text-primary-foreground shadow-sm" : "hover:text-foreground text-muted-foreground"}`}
              >
                Best Matches For Me ✨
              </button>
            </div>
          </motion.div>

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
              <AnimatePresence mode="popLayout">
                {filteredDogs.map((dog) => (
                  <motion.div key={dog.id} variants={itemVariants} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                    <DogCard dog={dog} user={userPreferences} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}