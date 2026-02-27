"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import DogCard from "@/components/DogCard"; 

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
        traits: {
          energy: "high",
          sociability: "friendly",
          trainability: "easy",
        },

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
        traits: {
          energy: "medium",
          sociability: "shy",
        }
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
        traits: {
          energy: "low",
          sociability: "friendly",
        }
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
        traits: {
          energy: "medium",
          sociability: "shy",
        }
      },
      {
        id: 5,
        sex: "Male",
        name: "Max",
        age: "4 years",
        breed: "Indie",
        status: "Available",
        location: "Jigani",
        images: ["/images/max.jpg",],
        traits: {
          energy: "high",
          sociability: "friendly",
        }
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
        traits: {
          energy: "medium",
          sociability: "shy",
        }
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
        traits: {
          energy: "low",
          sociability: "friendly",
        }
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
        traits: {
          energy: "high",
          sociability: "shy",
        }
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
        traits: {
          energy: "medium",
          sociability: "friendly",
        }
      },
    ];

    setDogs(mockDogs);
    setLoading(false);
  };

  return (
    <ProtectedRoute userType="citizen">
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-2oi py-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">Adopt a Street Dog</h1>
          <p className="text-muted-foreground mb-8">Give a stray a loving home</p>

          {loading ? (
            <p className="text-muted-foreground">Loading dogs...</p>
          ) : dogs.length === 0 ? (
            <p className="text-muted-foreground">No dogs available for adoption right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 md:grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} user={userPreferences}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}