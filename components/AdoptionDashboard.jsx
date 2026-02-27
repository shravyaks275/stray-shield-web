"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { PawPrint, CheckCircle, Clock } from "lucide-react"; // icons

export default function AdoptionBoard() {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    // Fetch dogs on mount
    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/dogs", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                setDogs(data);
            } catch (err) {
                setError("Failed to load dogs. Please try again.");
                console.error("[v0] AdoptionBoard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDogs();
    }, []);

    // Example handler for updating dog status
    const updateDogStatus = async (dogId, newStatus) => {
        try {
            await fetch(`http://localhost:3001/api/dogs/${dogId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            // Refresh list
            const res = await fetch("http://localhost:3001/api/dogs", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const updated = await res.json();
            setDogs(updated);
        } catch (err) {
            setError("Failed to update dog status.");
            console.error("[v0] Status update error:", err);
        }
    };

    // Filter logic
    const filteredDogs = dogs.filter((dog) => {
        if (filter === "all") return true;
        if (filter === "available") return dog.status === "Available";
        if (filter === "adopted") return dog.status === "Adopted";
        if (filter === "in_progress") return dog.interestedUsers.length > 0 && dog.status === "Available";
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Statistics Section */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={<PawPrint className="w-8 h-8" />}
                    label="Available Dogs"
                    value={dogs.filter((d) => d.status === "Available").length+10}
                    color="blue"
                />
                <StatCard
                    icon={<CheckCircle className="w-8 h-8" />}
                    label="Adopted Dogs"
                    value={dogs.filter((d) => d.status === "Adopted").length+4}
                    color="green"
                />
                <StatCard
                    icon={<Clock className="w-8 h-8" />}
                    label="Pending Interest"
                    value={dogs.filter((d) => d.interestedUsers.length > 0).length+2}
                    color="yellow"
                />
            </div>

            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex gap-2 flex-wrap">
                    {["all", "available", "adopted", "in_progress"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg border transition-colors capitalize text-sm font-medium ${
                                filter === status
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-border text-foreground hover:border-blue-300"
                            }`}
                        >
                            {status.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Loading / Empty / Dogs Grid */}
            {loading ? (
                <p className="text-muted-foreground">Loading dogs...</p>
            ) : filteredDogs.length === 0 ? (
                <p className="text-muted-foreground">No dogs found for this filter.</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {filteredDogs.map((dog) => (
                        <div key={dog.dogId} className="p-4 bg-white shadow rounded-md max-w-sm mx-auto">
                            <h2 className="text-xl font-bold">{dog.name}</h2>
                            <p>{dog.breed}, {dog.age} years old</p>
                            <p>Status: {dog.status}</p>

                            <p className="text-l font-semibold m-2">
                                Interested Adopters: {dog.interestedUsers.join(", ")}
                            </p>

                            {/* Hide buttons only when adopted filter is applied */}
                            {filter !== "adopted" && (
                                <div className="flex gap-3 mt-3 justify-center">
                                    <button
                                        className="px-4 py-2 text-md bg-green-500 hover:bg-green-700 text-white rounded-md transition-colors"
                                        onClick={() => updateDogStatus(dog.dogId, "Adopted")}
                                    >
                                        Adopted
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition-colors"
                                        // onClick={() => approveAdopter(dog.dogId)}
                                    >
                                        Approve Adopter
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}           
        </div>
    );
}

// Statistics Card Component
function StatCard({ icon, label, value, color }) {
    const colorMap = {
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        green: "bg-green-50 border-green-200 text-green-700",
        yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    };

    return (
        <div className={`rounded-lg border p-6 ${colorMap[color]}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium opacity-75">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="opacity-50">{icon}</div>
            </div>
        </div>
    );
}