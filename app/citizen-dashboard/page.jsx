"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import DogCard from "@/components/DogCard"; // You’ll create this next

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
        sex: "Male",
        name: "Buddy",
        age: "2 years",
        breed: "Indie",
        status: "Available",
        location: "Anekal",
        image: "/images/buddy.jpeg",
      },
      {
        id: 2,
        sex: "Female",
        name: "Maya",
        age: "1 year",
        breed: "Indie",
        status: "Available",
        location: "E-city",
        image: "/images/maya.jpeg",
      },
      {
        id: 3,
        sex: "Male",
        name: "Coco",
        age: "6 Months",
        breed: "Indie",
        status: "Available",
        location: "Hebbal",
        image: "/images/coco.jpeg",
      },
    ];

    setDogs(mockDogs);
    setLoading(false);
  };

  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4oi py-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Adopt a Street Dog</h1>
          <p className="text-muted-foreground mb-8">Give a stray a loving home</p>

          {loading ? (
            <p className="text-muted-foreground">Loading dogs...</p>
          ) : dogs.length === 0 ? (
            <p className="text-muted-foreground">No dogs available for adoption right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}