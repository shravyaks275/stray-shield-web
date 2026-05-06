export const initialDogs = [
    // New dogs for expanded NGOs and locations
    {
      id: 13,
      sex: "Female",
      name: "Ruby",
      age: "2 years",
      breed: "Indie",
      status: "Available",
      location: "Koramangala",
      ngo: "Hope Animal Shelter",
      contact: "9876500003",
      image: "/images/ruby.jpg",
      images: ["/images/ruby.jpg"],
      traits: { energy: "medium", sociability: "friendly", trainability: "easy", size: "medium" },
      healthRecords: [
        { id: 1301, date: "2025-04-10", type: "Vaccination", notes: "All vaccines up to date", by: "Clinic Vet", status: "completed" }
      ],
      aiHealthCheck: { label: "Healthy", confidence: "97%" }
    },
    {
      id: 14,
      sex: "Male",
      name: "Simba",
      age: "1 year 6 months",
      breed: "Indie",
      status: "Available",
      location: "Koramangala",
      ngo: "Bangalore Canine Trust",
      contact: "9000011111",
      image: "/images/simba.jpg",
      images: ["/images/simba.jpg"],
      traits: { energy: "high", sociability: "shy", trainability: "moderate", size: "large" },
      healthRecords: [
        { id: 1401, date: "2025-04-12", type: "Health Check", notes: "Energetic, needs training", by: "BCT Vet", status: "review" }
      ],
      aiHealthCheck: { label: "Energetic", confidence: "90%" }
    },
    {
      id: 15,
      sex: "Female",
      name: "Luna",
      age: "3 years",
      breed: "Indie",
      status: "Available",
      location: "Whitefield",
      ngo: "Safe Paws Foundation",
      contact: "9000022222",
      image: "/images/luna.jpg",
      images: ["/images/luna.jpg"],
      traits: { energy: "low", sociability: "friendly", trainability: "easy", size: "small" },
      healthRecords: [
        { id: 1501, date: "2025-04-15", type: "Vaccination", notes: "All vaccines up to date", by: "Safe Paws Vet", status: "completed" }
      ],
      aiHealthCheck: { label: "Healthy", confidence: "99%" }
    },
    {
      id: 16,
      sex: "Male",
      name: "Oscar",
      age: "2 years 3 months",
      breed: "Indie",
      status: "Available",
      location: "Whitefield",
      ngo: "Stray Shield Official",
      contact: "9988776655",
      image: "/images/oscar.jpg",
      images: ["/images/oscar.jpg"],
      traits: { energy: "medium", sociability: "shy", trainability: "moderate", size: "medium" },
      healthRecords: [
        { id: 1601, date: "2025-04-18", type: "Health Check", notes: "Healthy, shy temperament", by: "Stray Shield Vet", status: "cleared" }
      ],
      aiHealthCheck: { label: "Healthy", confidence: "95%" }
    },
    {
      id: 17,
      sex: "Female",
      name: "Misty",
      age: "1 year",
      breed: "Indie",
      status: "Available",
      location: "Vijaynagar",
      ngo: "Bangalore Canine Trust",
      contact: "9000011111",
      image: "/images/misty.jpg",
      images: ["/images/misty.jpg"],
      traits: { energy: "medium", sociability: "friendly", trainability: "easy", size: "medium" },
      healthRecords: [
        { id: 1701, date: "2025-04-20", type: "Vaccination", notes: "All vaccines up to date", by: "BCT Vet", status: "completed" }
      ],
      aiHealthCheck: { label: "Healthy", confidence: "98%" }
    },
    {
      id: 18,
      sex: "Male",
      name: "Shadow",
      age: "2 years",
      breed: "Indie",
      status: "Available",
      location: "Vijaynagar",
      ngo: "City Pet Rescue",
      contact: "9876532109",
      image: "/images/shadow.jpg",
      images: ["/images/shadow.jpg"],
      traits: { energy: "high", sociability: "shy", trainability: "hard", size: "large" },
      healthRecords: [
        { id: 1801, date: "2025-04-22", type: "Health Check", notes: "Needs socialization", by: "City Pet Vet", status: "review" }
      ],
      aiHealthCheck: { label: "Needs Socialization", confidence: "80%" }
    },
    {
      id: 19,
      sex: "Female",
      name: "Daisy",
      age: "2 years",
      breed: "Indie",
      status: "Available",
      location: "Hebbal",
      ngo: "Safe Paws Foundation",
      contact: "9000022222",
      image: "/images/daisy.jpg",
      images: ["/images/daisy.jpg"],
      traits: { energy: "medium", sociability: "friendly", trainability: "easy", size: "medium" },
      healthRecords: [
        { id: 1901, date: "2025-04-25", type: "Vaccination", notes: "All vaccines up to date", by: "Safe Paws Vet", status: "completed" }
      ],
      aiHealthCheck: { label: "Healthy", confidence: "97%" }
    },
    {
      id: 20,
      sex: "Male",
      name: "Rocky",
      age: "3 years",
      breed: "Indie",
      status: "Available",
      location: "Hebbal",
      ngo: "City Pet Rescue",
      contact: "9876532109",
      image: "/images/rocky.jpg",
      images: ["/images/rocky.jpg"],
      traits: { energy: "high", sociability: "shy", trainability: "moderate", size: "large" },
      healthRecords: [
        { id: 2001, date: "2025-04-28", type: "Health Check", notes: "Energetic, needs training", by: "City Pet Vet", status: "review" }
      ],
      aiHealthCheck: { label: "Energetic", confidence: "90%" }
    },
    {
      id: 21,
      sex: "Female",
      name: "Maggie",
      age: "2 years",
      breed: "Indie",
      status: "Available",
      location: "Anekal",
      ngo: "Bangalore Canine Trust",
      contact: "9000011111",
      image: "/images/maggie.jpg",
      images: ["/images/maggie.jpg"],
      traits: { energy: "medium", sociability: "friendly", trainability: "easy", size: "medium" },
      healthRecords: [
        { id: 2101, date: "2025-04-30", type: "Vaccination", notes: "All vaccines up to date", by: "BCT Vet", status: "completed" }
      ],
      aiHealthCheck: { label: "Healthy", confidence: "97%" }
    },
    {
      id: 22,
      sex: "Male",
      name: "Bruno",
      age: "1 year 8 months",
      breed: "Indie",
      status: "Available",
      location: "Anekal",
      ngo: "Stray Shield Official",
      contact: "9988776655",
      image: "/images/bruno.jpg",
      images: ["/images/bruno.jpg"],
      traits: { energy: "high", sociability: "shy", trainability: "moderate", size: "large" },
      healthRecords: [
        { id: 2201, date: "2025-05-02", type: "Health Check", notes: "Energetic, needs training", by: "Stray Shield Vet", status: "review" }
      ],
      aiHealthCheck: { label: "Energetic", confidence: "90%" }
    },
  {
    id: 1,
    sex: "Female",
    name: "Zoe",
    age: "1 year",
    breed: "Indie",
    status: "Available",
    location: "Indiranagar",
    ngo: "Paws & Care Rescue",
    contact: "9876543210",
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
    ngo: "Stray Shield Official",
    contact: "9876500002",
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
    ngo: "Hope Animal Shelter",
    contact: "9876500003",
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
  ngo: "City Pet Rescue",
  contact: "9876500004",
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
  ngo: "Stray Shield Official",
  contact: "9876500005",
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
  ngo: "Paws & Care Rescue",
   contact: "9876500006",
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
  ngo: "Stray Shield Official",
  contact: "9876500007",
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
  ngo: "Hope Animal Shelter",
  contact: "9876500003",
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
  ngo: "City Pet Rescue",
  contact: "9876500004",
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
  ngo: "Paws & Care Rescue",
  contact: "9876500006",
  image: "/images/pogo_2.jpg",
  images: ["/images/pogo_2.jpg"],
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
  ngo: "Hope Animal Shelter",
  contact: "9876500003",
  image: "/images/pogo_3.jpg",
  images: ["/images/pogo_3.jpg"],
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
  ngo: "City Pet Rescue",
  contact: "9876500004",
  image: "/images/milo_2.jpg",
  images: ["/images/milo_2.jpg"],
  traits: { energy: "high", sociability: "friendly", trainability: "hard", size: "large" },
  healthRecords: [
    { id: 1201, date: "2025-03-20", type: "Health Check", notes: "Strong build, requires exercise plan", by: "NGO Vet", status: "cleared" }
  ],
  aiHealthCheck: { label: "Strong & Healthy", confidence: "98%" }
},
{
  id: 23,
  sex: "Male",
  name: "Buster",
  age: "2 years",
  breed: "Indie",
  status: "Available",
  location: "Jayanagar",
  ngo: "City Pet Rescue",
  contact: "9876532109",
  image: "/images/pogo_1.jpg",
  images: ["/images/pogo_1.jpg"],
  traits: { energy: "high", sociability: "friendly", trainability: "moderate", size: "medium" },
  healthRecords: [
    { id: 2301, date: "2025-05-01", type: "Vaccination", notes: "Vaccinated", by: "City Pet Vet", status: "completed" }
  ],
  aiHealthCheck: { label: "Healthy", confidence: "94%" }
},
{
  id: 24,
  sex: "Female",
  name: "Lucy",
  age: "1 year",
  breed: "Indie",
  status: "Available",
  location: "Jayanagar",
  ngo: "Safe Paws Foundation",
  contact: "9000022222",
  image: "/images/zoe_1.jpg",
  images: ["/images/zoe_1.jpg"],
  traits: { energy: "medium", sociability: "friendly", trainability: "easy", size: "small" },
  healthRecords: [
    { id: 2401, date: "2025-05-02", type: "Health Check", notes: "Healthy pup", by: "Safe Paws Vet", status: "cleared" }
  ],
  aiHealthCheck: { label: "Excellent Match", confidence: "99%" }
}
];
