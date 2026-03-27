"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertCircle, PawPrint, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { initialDogs } from "@/lib/mockData";

export default function AdoptionBoard() {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    const fetchDogs = async () => {
        setLoading(true);
        setError("");
        try {
            // Load unified mock data
            let mockDogs = [];
            if (typeof window !== "undefined") {
              const saved = localStorage.getItem("straydogs_data_v3");
              if (saved) {
                try {
                  mockDogs = JSON.parse(saved);
                } catch (err) {
                  console.warn("[v0] adoption board stale localStorage, resetting:", err);
                  mockDogs = [];
                }
              }
            }

            if (!Array.isArray(mockDogs) || mockDogs.length === 0) {
              mockDogs = initialDogs;
            }

            // Remove accidental duplicates and standardize shape
            const dogMap = new Map();
            mockDogs.forEach((d, idx) => {
              const id = d.id ?? d.dogId ?? `dog-${idx}`
              if (!dogMap.has(id)) {
                dogMap.set(id, {
                  ...d,
                  dogId: id,
                  interestedUsers: d.interestedUsers || (d.status === "Reviewing" ? [{ userName: "Review Applicant" }] : []),
                })
              }
            })

            const mergedDogs = Array.from(dogMap.values())
            if (typeof window !== "undefined") {
              localStorage.setItem("straydogs_data_v3", JSON.stringify(mergedDogs))
            }
            setDogs(mergedDogs);
        } catch (err) {
            setError("Failed to load dogs. Please try again.");
            console.error("[v0] AdoptionBoard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDogs();
    }, []);

    const updateDogStatus = async (dogId, newStatus) => {
        try {
            setDogs((prev) => {
                const updated = prev.map((dog) =>
                    dog.dogId === dogId ? { ...dog, status: newStatus } : dog
                );
                // Also update localStorage
                const mappedBack = updated.map(d => ({...d, id: d.dogId}));
                localStorage.setItem("straydogs_data_v3", JSON.stringify(mappedBack));
                return updated;
            });
        } catch (err) {
            setError("Failed to update dog status.");
            console.error("[v0] Status update error:", err);
        }
    };

    const filteredDogs = useMemo(() => dogs.filter((dog) => {
        if (filter === "all") return true;
        if (filter === "available") return dog.status === "Available";
        if (filter === "adopted") return dog.status === "Adopted";
        if (filter === "in_progress") return dog.interestedUsers.length > 0 && dog.status === "Available";
        return true;
    }), [dogs, filter]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full flex flex-col space-y-10">
            {/* Statistics Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
                <StatCard
                    icon={<PawPrint className="w-8 h-8 text-primary" />}
                    label="Available Dogs"
                    value={dogs.filter((d) => d.status === "Available").length}
                    colorClass="bg-primary/5 border-primary/20 text-foreground"
                    glow="shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]"
                />
                <StatCard
                    icon={<CheckCircle className="w-8 h-8 text-green-500" />}
                    label="Adopted Dogs"
                    value={dogs.filter((d) => d.status === "Adopted").length}
                    colorClass="bg-green-500/5 border-green-500/20 text-foreground"
                    glow="shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]"
                />
                <StatCard
                    icon={<Clock className="w-8 h-8 text-indigo-500" />}
                    label="Pending Interest"
                    value={dogs.filter((d) => d.interestedUsers.length > 0).length}
                    colorClass="bg-indigo-500/5 border-indigo-500/20 text-foreground"
                    glow="shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]"
                />
            </motion.div>

            {/* Filter and Refresh Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-3 bg-secondary/20 p-2 rounded-2xl w-fit border border-white/10 backdrop-blur-md"
                >
                    {["all", "available", "adopted", "in_progress"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-xl capitalize text-sm font-bold transition-all relative ${filter === status
                                    ? "text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                }`}
                        >
                            {filter === status && (
                                <motion.div layoutId="boardFilter" className="absolute inset-0 bg-primary rounded-xl -z-10" transition={{ type: "spring", stiffness: 300, damping: 20 }} />
                            )}
                            <span className="relative z-10">{status.replace("_", " ")}</span>
                        </button>
                    ))}
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchDogs}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-xl hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.5)] transition-all font-bold disabled:opacity-70 w-full sm:w-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh Data
                </motion.button>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-destructive font-bold">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading / Empty / Dogs Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="text-muted-foreground font-bold animate-pulse">Loading adoption board...</p>
                </div>
            ) : filteredDogs.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-16 text-center rounded-[2rem] border border-white/20">
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PawPrint className="w-10 h-10 text-muted-foreground opacity-50" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground mb-2">No dogs found</h2>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto">
                        There are no dogs matching the "{filter.replace("_", " ")}" filter at the moment.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredDogs.map((dog) => (
                        <motion.div
                            key={dog.dogId}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.015 }}
                            className="bg-card glass rounded-[1.5rem] border border-border/50 shadow-lg overflow-hidden flex flex-col transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] relative group cursor-pointer"
                        >
                            {/* Accent Gradient Line at Top */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                            <div className="p-6 flex-grow flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-4 gap-2">
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1 truncate">{dog.name}</h2>
                                        <p className="text-sm font-bold text-muted-foreground truncate">{dog.breed} • {dog.age} {dog.age === 1 ? 'yr' : 'yrs'}</p>
                                    </div>
                                    <span className={`px-3 py-1 flex-shrink-0 rounded-full text-xs font-bold border backdrop-blur-md ${dog.status === 'Available' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                                        {dog.status}
                                    </span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex-grow flex flex-col">
                                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-foreground opacity-60 mb-3 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" /> Interested Adopters
                                    </h4>
                                    {dog.interestedUsers.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 flex-grow content-start">
                                            {dog.interestedUsers.map((user, idx) => (
                                                <div key={idx} className="text-xs font-bold bg-secondary/40 text-foreground px-3 py-1.5 rounded-full border border-white/10 shadow-sm flex items-center">
                                                    {user.userName || user}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center bg-secondary/20 rounded-xl border border-dashed border-white/10 p-4">
                                            <p className="text-sm text-muted-foreground font-medium italic">No applicants yet.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions Base */}
                                {dog.status === "Available" ? (
                                    <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateDogStatus(dog.dogId, "Adopted")}
                                            className="px-4 py-3 text-sm font-bold bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white border border-green-500/20 rounded-xl transition-all shadow-sm hover:shadow-md"
                                        >
                                            Mark Adopted
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateDogStatus(dog.dogId, "Approved")}
                                            className="px-4 py-3 text-sm font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-xl transition-all shadow-sm hover:shadow-md"
                                        >
                                            Approve User
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center p-3 rounded-xl bg-secondary/50 border border-white/10 text-sm font-bold text-foreground">
                                        {dog.status === "Adopted" ? "Marked as Adopted 🌟" : "User Approved ✅"}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

// Statistics Card Component
function StatCard({ icon, label, value, colorClass, glow }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-panel border rounded-[1.5rem] p-6 lg:p-8 transition-all ${colorClass} ${glow} relative overflow-hidden`}
        >
            <div className="absolute top-[-50%] right-[-10%] w-[150px] h-[150px] bg-white mix-blend-overlay opacity-10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-extrabold tracking-wide uppercase opacity-75 mb-1">{label}</p>
                    <motion.p
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                        className="text-4xl sm:text-5xl font-black tracking-tight"
                    >
                        {value}
                    </motion.p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner border border-white/5">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}