export const ngoDatabase = [
  {
    id: 1,
    name: "Paws & Care Rescue",
    location: ["Indiranagar", "Hosa Road", "Koramangala", "E-city"],
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
    location: ["Jigani", "Anekal", "Indiranagar", "Whitefield"],
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
    location: ["Kudlu Gate", "E-city", "Whitefield", "Koramangala", "Yelahanka"],
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
    location: ["Vijaynagar", "Hebbal", "Yelahanka", "Jigani", "Jayanagar"],
    email: "rescue@citypet.in",
    phone: "+91 98765 32109",
    website: "www.citypet.in",
    bio: "Urban-focused rescue organization committed to street dog welfare and adoption.",
    logo: "/images/ngo_logo_4.jpg",
    established: 2017,
    adoptionRate: "80%"
  },
  {
    id: 5,
    name: "Bangalore Canine Trust",
    location: ["Koramangala", "Vijaynagar", "Anekal", "Hosa Road"],
    email: "info@bct.org",
    phone: "+91 90000 11111",
    website: "www.bct.org",
    bio: "Focused on adoption and rehabilitation of stray dogs in Bangalore.",
    logo: "/images/ngo_logo_5.jpg",
    established: 2021,
    adoptionRate: "78%"
  },
  {
    id: 6,
    name: "Safe Paws Foundation",
    location: ["Whitefield", "Hebbal", "Kudlu Gate", "Jayanagar"],
    email: "contact@safepaws.org",
    phone: "+91 90000 22222",
    website: "www.safepaws.org",
    bio: "Providing safe shelter and adoption for strays across Bangalore.",
    logo: "/images/ngo_logo_6.jpg",
    established: 2022,
    adoptionRate: "83%"
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
