export const ngoDatabase = [
  {
    id: 1,
    name: "Paws & Care Rescue",
    location: ["Indiranagar", "Hosa Road"],
    email: "contact@pawscare.org",
    phone: "+91 98765 43210",
    website: "www.pawscare.org",
    bio: "Dedicated to rescuing and rehabilitating stray dogs with veterinary care.",
    logo: "/images/ngo_logo_1.jpg",
    established: 2018,
    adoptionRate: "85%"
  },
  {
    id: 2,
    name: "Stray Shield Official",
    location: ["Jigani", "Anekal"],
    email: "hello@strayshield.org",
    phone: "+91 99887 76655",
    website: "www.strayshield.org",
    bio: "Main Stray Shield platform supporting rescue, health assessment, and adoption.",
    logo: "/images/ngo_logo_2.jpg",
    established: 2020,
    adoptionRate: "92%"
  },
  {
    id: 3,
    name: "Hope Animal Shelter",
    location: ["Kudlu Gate", "E-city"],
    email: "info@hopeanimal.org",
    phone: "+91 98765 54321",
    website: "www.hopeanimal.org",
    bio: "Comprehensive animal care facility providing shelter, medical care, and adoption services.",
    logo: "/images/ngo_logo_3.jpg",
    established: 2019,
    adoptionRate: "88%"
  },
  {
    id: 4,
    name: "City Pet Rescue",
    location: ["Vijaynagar"],
    email: "rescue@citypet.in",
    phone: "+91 98765 32109",
    website: "www.citypet.in",
    bio: "Urban-focused rescue organization committed to street dog welfare and adoption.",
    logo: "/images/ngo_logo_4.jpg",
    established: 2017,
    adoptionRate: "80%"
  }
];

// Get NGO by name
export function getNgoByName(ngoName) {
  return ngoDatabase.find(ngo => ngo.name === ngoName);
}

// Get NGOs by location
export function getNgosByLocation(location) {
  return ngoDatabase.filter(ngo => ngo.location.includes(location));
}

// Get all locations
export function getAllLocations() {
  const locations = new Set();
  ngoDatabase.forEach(ngo => {
    ngo.location.forEach(loc => locations.add(loc));
  });
  return Array.from(locations);
}
