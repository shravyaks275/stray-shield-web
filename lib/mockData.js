export const initialDogs = [
  {
    id: 1,
    sex: "Female",
    name: "Zoe",
    age: "1 year",
    breed: "Indie",
    status: "Available",
    location: "Indiranagar",
    image: "/images/zoe_1.jpg",
    images: ["/images/zoe_1.jpg", "/images/zoe_2.jpg", "/images/zoe_3.jpg"],
    traits: { energy: "high", sociability: "friendly", trainability: "easy", size: "medium" },
    healthRecords: [
      { id: 101, date: "2025-01-15", type: "Vaccination", notes: "Rabies, Core vaccines administered", by: "Dr. Smith (NGO Vet)", status: "completed" },
      { id: 102, date: "2025-02-10", type: "Health Check", notes: "General checkup - healthy", by: "City Clinic", status: "cleared" },
      { id: 103, date: "2025-03-20", type: "Treatment", notes: "Flea and tick treatment", by: "Shelter Staff", status: "completed" },
      { id: 104, date: "2025-04-05", type: "Vaccination", notes: "Parvovirus booster", by: "Dr. Meera", status: "completed" }
    ],
    aiHealthCheck: { label: "Excellent Match", confidence: "98%" }
  },
  {
    id: 2,
    sex: "Male",
    name: "Pogo",
    age: "3 years 4 months",
    breed: "Indie",
    status: "Reviewing",
    location: "Jigani",
    image: "/images/pogo_1.jpg",
    images: ["/images/pogo_1.jpg", "/images/pogo_2.jpg", "/images/pogo_3.jpg"],
    traits: { energy: "medium", sociability: "shy", trainability: "moderate", size: "small" },
    healthRecords: [
      { id: 201, date: "2024-11-20", type: "Sterilization", notes: "Neutered successfully", by: "Rescue Shelter", status: "completed" },
      { id: 202, date: "2025-01-05", type: "Vaccination", notes: "Booster shot", by: "Dr. Alan", status: "completed" },
      { id: 203, date: "2025-03-12", type: "Health Check", notes: "Weight slightly above normal", by: "Dr. Alan", status: "review" }
    ],
    aiHealthCheck: { label: "Requires Diet Plan", confidence: "85%" }
  },
  {
    id: 3,
    sex: "Male",
    name: "Milo",
    age: "2 years",
    breed: "Indie",
    status: "Available",
    location: "Kudlu Gate",
    image: "/images/milo_1.jpg",
    images: ["/images/milo_1.jpg", "/images/milo_2.jpg"],
    traits: { energy: "low", sociability: "friendly", trainability: "easy", size: "small" },
    healthRecords: [
      { id: 301, date: "2025-03-01", type: "Treatment", notes: "Treated for minor paw injury", by: "Dr. Jane", status: "pending" },
      { id: 302, date: "2025-03-15", type: "Health Check", notes: "Paw healing well", by: "Shelter Vet", status: "cleared" },
      { id: 303, date: "2025-04-01", type: "Vaccination", notes: "Distemper vaccine administered", by: "Dr. Jane", status: "completed" }
    ],
    aiHealthCheck: { label: "Healing Phase", confidence: "90%" }
  },
 {
  id: 4,
  sex: "Male",
  name: "Charlie",
  age: "3 years",
  breed: "Indie",
  status: "Reviewing",
  location: "Vijaynagar",
  image: "/images/charlie.jpg",
  images: ["/images/charlie.jpg"],
  traits: { energy: "medium", sociability: "shy", trainability: "moderate", size: "medium" },
  healthRecords: [
    { id: 401, date: "2025-01-10", type: "Health Check", notes: "Dental cleaning required soon", by: "Dr. Smith", status: "pending" },
    { id: 402, date: "2025-02-20", type: "Treatment", notes: "Minor gum inflammation treated", by: "Dr. Smith", status: "completed" }
  ],
  aiHealthCheck: { label: "Dental Issue Detected", confidence: "75%" }
},
{
  id: 5,
  sex: "Male",
  name: "Max",
  age: "4 years 6 months",
  breed: "Indie",
  status: "Available",
  location: "Jigani",
  image: "/images/max.jpg",
  images: ["/images/max.jpg"],
  traits: { energy: "high", sociability: "friendly", trainability: "easy", size: "large" },
  healthRecords: [
    { id: 501, date: "2025-02-01", type: "Vaccination", notes: "Annual booster", by: "Mobile Vet Clinic", status: "completed" },
    { id: 502, date: "2025-03-15", type: "Health Check", notes: "Routine checkup - healthy", by: "Dr. Priya", status: "cleared" }
  ],
  aiHealthCheck: { label: "Healthy", confidence: "92%" }
},
{
  id: 6,
  sex: "Female",
  name: "Bella",
  age: "8 months",
  breed: "Indie",
  status: "Reviewing",
  location: "Hosa Road",
  image: "/images/bella.jpg",
  images: ["/images/bella.jpg"],
  traits: { energy: "medium", sociability: "shy", trainability: "moderate", size: "medium" },
  healthRecords: [
    { id: 601, date: "2025-03-25", type: "Vaccination", notes: "First puppy shots scheduled", by: "Clinic Vet", status: "pending" }
  ],
  aiHealthCheck: { label: "Pending Vaccination", confidence: "60%" }
},
{
  id: 7,
  sex: "Male",
  name: "Buddy",
  age: "2 years",
  breed: "Indie",
  status: "Available",
  location: "Anekal",
  image: "/images/buddy.jpeg",
  images: ["/images/buddy.jpeg"],
  traits: { energy: "low", sociability: "friendly", trainability: "moderate", size: "small" },
  healthRecords: [
    { id: 701, date: "2025-01-20", type: "Health Check", notes: "Healthy and active", by: "NGO Vet", status: "cleared" },
    { id: 702, date: "2025-03-05", type: "Vaccination", notes: "Deworming and booster shots", by: "NGO Vet", status: "completed" }
  ],
  aiHealthCheck: { label: "Healthy", confidence: "95%" }
},
{
  id: 8,
  sex: "Female",
  name: "Maya",
  age: "1 year 2 months",
  breed: "Indie",
  status: "Available",
  location: "E-city",
  image: "/images/maya_1.jpg",
  images: ["/images/maya_1.jpg"],
  traits: { energy: "high", sociability: "shy", trainability: "hard", size: "medium" },
  healthRecords: [
    { id: 801, date: "2024-12-11", type: "Vaccination", notes: "Anti-rabies completed", by: "City Clinic", status: "completed" },
    { id: 802, date: "2025-03-18", type: "Health Check", notes: "High energy, needs training support", by: "Shelter Vet", status: "review" }
  ],
  aiHealthCheck: { label: "Healthy", confidence: "96%" }
},
{
  id: 9,
  sex: "Male",
  name: "Coco",
  age: "4 Months",
  breed: "Indie",
  status: "Reviewing",
  location: "Hebbal",
  image: "/images/coco.jpeg",
  images: ["/images/coco.jpeg"],
  traits: { energy: "medium", sociability: "friendly", trainability: "easy", size: "small" },
  healthRecords: [
    { id: 901, date: "2025-03-22", type: "Treatment", notes: "Deworming scheduled", by: "Clinic Vet", status: "pending" }
  ],
  aiHealthCheck: { label: "Needs Deworming", confidence: "80%" }
},
{
  id: 10,
  sex: "Male",
  name: "Leo",
  age: "5 years",
  breed: "Indie Mix",
  status: "Available",
  location: "Koramangala",
  image: "/images/zoe_1.jpg",
  images: ["/images/zoe_1.jpg"],
  traits: { energy: "moderate", sociability: "friendly", trainability: "moderate", size: "medium" },
  healthRecords: [
    { id: 1001, date: "2025-02-28", type: "Health Check", notes: "Cleared for adoption", by: "NGO Vet", status: "cleared" },
    { id: 1002, date: "2025-03-25", type: "Vaccination", notes: "Booster shots updated", by: "NGO Vet", status: "completed" }
  ],
  aiHealthCheck: { label: "Healthy", confidence: "94%" }
},
{
  id: 11,
  sex: "Female",
  name: "Nala",
  age: "7 years",
  breed: "Indie",
  status: "Available",
  location: "Whitefield",
  image: "/images/pogo_1.jpg",
  images: ["/images/pogo_1.jpg"],
  traits: { energy: "relaxed", sociability: "shy", trainability: "easy", size: "small" },
  healthRecords: [
    { id: 1101, date: "2025-01-10", type: "Treatment", notes: "Dental scaling done", by: "Clinic Vet", status: "completed" },
    { id: 1102, date: "2025-03-12", type: "Health Check", notes: "Follow-up dental check required", by: "Clinic Vet", status: "pending" }
  ],
  aiHealthCheck: { label: "Needs Dental Care", confidence: "88%" }
},
{
  id: 12,
  sex: "Male",
  name: "Rocky",
  age: "2 years",
  breed: "Mudhol Hound Mix",
  status: "Reviewing",
  location: "Yelahanka",
  image: "/images/milo_1.jpg",
  images: ["/images/milo_1.jpg"],
  traits: { energy: "high", sociability: "friendly", trainability: "hard", size: "large" },
  healthRecords: [
    { id: 1201, date: "2025-03-20", type: "Health Check", notes: "Strong build, requires exercise plan", by: "NGO Vet", status: "cleared" }
  ],
  aiHealthCheck: { label: "Strong & Healthy", confidence: "98%" }
}
];
