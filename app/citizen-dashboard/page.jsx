"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import DogCard, { calculateMatch } from "@/components/DogCard";
import { motion, AnimatePresence } from "framer-motion";
import { initialDogs } from "@/lib/mockData";
import { ngoDatabase, getAllLocations } from "@/config/ngoData";

function LocationDropdown({ locations, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value === "All" ? "" : value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  useEffect(() => {
    setInputValue(value === "All" ? "" : value);
  }, [value]);

  const filteredLocations = locations.filter(loc => loc !== "All" && loc.toLowerCase().includes(inputValue.toLowerCase()));

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [inputValue, isOpen]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Location..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value || "All");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setIsOpen(true);
              setHighlightedIndex(prev => prev < filteredLocations.length - 1 ? prev + 1 : prev);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (isOpen) setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
            } else if (e.key === 'Enter' && isOpen && highlightedIndex >= 0) {
              e.preventDefault();
              const loc = filteredLocations[highlightedIndex];
              if (loc) {
                setInputValue(loc);
                onChange(loc);
                setIsOpen(false);
              }
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          className="w-full bg-background/50 border border-border/50 rounded-xl px-2 py-2 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-shadow"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 w-full mt-1 bg-background border border-border/50 rounded-xl shadow-xl max-h-60 overflow-auto scrollbar-hide"
          >
            {filteredLocations.map((loc, index) => (
              <li
                key={loc}
                onClick={() => {
                  setInputValue(loc);
                  onChange(loc);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer text-sm transition-colors ${highlightedIndex === index ? "bg-secondary/80 text-foreground" : "text-foreground hover:bg-secondary/50"}`}
              >
                {loc}
              </li>
            ))}
            {filteredLocations.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground text-center">No localities found</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CitizenDashboard() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedNgo, setSelectedNgo] = useState("All");
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

    let dogData = initialDogs;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("straydogs_data_v5");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          // FIX: merge with initialDogs to include new fields like contact
          dogData = parsed.map((dog, index) => ({
            ...initialDogs[index], // ensures contact + new fields
            ...dog
          }));

        } catch (err) {
          console.warn("[v0] citizen dashboard got stale data, resetting:", err);
          dogData = initialDogs;
          localStorage.setItem("straydogs_data_v5", JSON.stringify(initialDogs));
        }
      } else {
        localStorage.setItem("straydogs_data_v5", JSON.stringify(initialDogs));
      }
    }

    // Deduplicate by ID
    const uniqueMap = new Map();
    dogData.forEach((dog, idx) => {
      const id = dog.id ?? dog.dogId ?? `dog-${idx}`;
      if (!uniqueMap.has(id)) {
        uniqueMap.set(id, { ...dog, id });
      }
    });

    const uniqueDogs = Array.from(uniqueMap.values());

    // Only show dogs marked as 'Available'
    setDogs(uniqueDogs.filter(d => d.status === "Available"));
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

  const locations = useMemo(() => {
    return ["All", ...getAllLocations()];
  }, []);

  const ngos = useMemo(() => {
    let filteredForNgo = dogs;
    if (selectedLocation !== "All" && selectedLocation.trim() !== "") {
      filteredForNgo = dogs.filter(d => d.location.toLowerCase() === selectedLocation.toLowerCase());
    }
    return ["All", ...Array.from(new Set(filteredForNgo.map(d => d.ngo))).filter(Boolean)];
  }, [dogs, selectedLocation]);

  // Reset NGO when location changes
  useEffect(() => {
    setSelectedNgo("All");
  }, [selectedLocation]);

  const filteredDogs = useMemo(() => {
    let result = dogs;

    if (selectedLocation !== "All" && selectedLocation.trim() !== "") {
      result = result.filter(dog => dog.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    if (selectedNgo !== "All") {
      result = result.filter(dog => dog.ngo === selectedNgo);
    }

    if (filter === "all") return result;
    return result.filter(dog => calculateMatch(dog, userPreferences) >= 5);
  }, [dogs, filter, userPreferences, selectedLocation, selectedNgo]);

  const groupedDogs = useMemo(() => {
    const groups = {};
    filteredDogs.forEach(dog => {
      if (!groups[dog.ngo]) {
        groups[dog.ngo] = [];
      }
      groups[dog.ngo].push(dog);
    });
    return groups;
  }, [filteredDogs]);

  const hasNoNgosInLocation = useMemo(() => {
    if (selectedLocation === "All" || !selectedLocation.trim()) return false;
    const query = selectedLocation.toLowerCase();
    const ngosInLocation = ngoDatabase.filter(ngo => ngo.location.some(l => l.toLowerCase() === query));
    return ngosInLocation.length === 0;
  }, [selectedLocation]);

  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50" />

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="mb-0 text-center sm:text-left">
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

          <div className="flex justify-end w-full">
            <div className="flex gap-3 w-auto mb-1">

              <div className="w-40">
                <label className="text-xs font-bold text-muted-foreground uppercase px-2 mb-1 block">Location</label>
                <LocationDropdown 
                  locations={locations} 
                  value={selectedLocation} 
                  onChange={setSelectedLocation} 
                />
              </div>
              <div className="w-40">
                <label className="text-xs font-bold text-muted-foreground uppercase px-2 mb-1 block">NGO</label>
                <select
                  value={selectedNgo}
                  onChange={(e) => setSelectedNgo(e.target.value)}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-shadow"
                >
                  {ngos.map(ngo => (
                    <option key={ngo} value={ngo}>{ngo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* New Personality Inputs & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-6 p-4 bg-secondary/10 border border-white/10 rounded-[2rem] backdrop-blur-md shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
              <h3 className="text-xl font-black text-foreground tracking-tight">Find Your Match</h3>

            </div>

            {/* Row 1: Dropdowns + Apply */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-end border-b border-border/50 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow w-full">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase px-2 mb-2 block">Lifestyle</label>
                  <select
                    value={userPreferences.lifestyle}
                    onChange={(e) => setUserPreferences({ ...userPreferences, lifestyle: e.target.value })}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-shadow"
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
                    onChange={(e) => setUserPreferences({ ...userPreferences, household: e.target.value })}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-shadow"
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
                    onChange={(e) => setUserPreferences({ ...userPreferences, experience: e.target.value })}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-shadow"
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
                    onChange={(e) => setUserPreferences({ ...userPreferences, space: e.target.value })}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-2 pr-8 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-shadow"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House w/ Yard</option>
                    <option value="farm">Farm / Large Land</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setFilter("for_me")}
                className="h-[42px] px-8 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all flex-shrink-0 w-full md:w-auto"
              >
                Apply
              </button>
            </div>

            {/* Row 2: View Toggles */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${filter === "all"
                  ? "bg-secondary text-secondary-foreground border-transparent shadow-sm"
                  : "bg-background/40 hover:bg-background/80 text-foreground border-border/60"
                  }`}
              >
                View All Dogs
              </button>

              <button
                onClick={() => setFilter("for_me")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${filter === "for_me"
                  ? "bg-secondary text-secondary-foreground border-transparent shadow-sm"
                  : "bg-background/40 hover:bg-background/80 text-foreground border-border/60"
                  }`}
              >
                For Me ✨
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">Loading amazing dogs...</p>
            </div>
          ) : hasNoNgosInLocation ? (
            <div className="glass-panel p-12 text-center rounded-[2rem] border border-white/20">
              <div className="w-20 h-20 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏢</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No NGOs registered in {selectedLocation}</h2>
              <p className="text-muted-foreground">Try searching for a different locality in Bangalore.</p>
            </div>
          ) : filteredDogs.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-[2rem] border border-white/20">
              <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🐕</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No up-to-date listings</h2>
              <p className="text-muted-foreground">Check back later for new companions available for adoption.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {Object.entries(groupedDogs).map(([ngoName, ngoDogs]) => (
                <div key={ngoName}>
                  <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]">
                      {ngoName.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">{ngoName}</h2>
                    <span className="ml-auto text-sm font-bold text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full border border-white/5">
                      {ngoDogs.length} {ngoDogs.length === 1 ? 'Dog' : 'Dogs'}
                    </span>
                  </div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {ngoDogs.map((dog) => (
                        <motion.div key={dog.id} variants={itemVariants} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                          <DogCard dog={dog} user={userPreferences} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}