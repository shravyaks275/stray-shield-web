import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

// Simple compatibility scoring function
function calculateMatch(dog, user) {
  let score = 0;

  // Energy matching with partial credit
  if (dog.traits?.energy === "high" && user.lifestyle === "active") score += 2;
  else if (dog.traits?.energy === "medium" && user.lifestyle === "active") score += 1;

  // Sociability
  if (dog.traits?.sociability === "friendly" && user.household !== "single") score += 2;
  else if (dog.traits?.sociability === "friendly") score += 1;

  // Trainability
  if (dog.traits?.trainability === "easy" && user.experience === "beginner") score += 2;
  else if (dog.traits?.trainability === "moderate" && user.experience !== "beginner") score += 1;

  // Size vs space
  if (dog.traits?.size === "small" && user.space === "apartment") score += 2;
  else if (dog.traits?.size === "medium" && user.space === "apartment") score += 1;

  return score;
}

export default function DogCard({ dog, user }) {
  // Always have an array to map over
  const images = Array.isArray(dog.images) ? dog.images : [dog.image];
  const score = calculateMatch(dog, user); // Calculate compatibility score

  return (
    <div className="border rounded-lg p-4 bg-card shadow-sm flex flex-col">
     
     {/* Swiper for images */}
      <div className="relative w-full h-55 mb-4">
        <Swiper
          className="dog-swiper"
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`${dog.name}-${index}`}
                className="w-full h-55 object-cover rounded-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-foreground">{dog.name}</h2>
        <p className="text-sm text-muted-foreground">
          {dog.breed} • {dog.age} - {dog.sex}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Location: {dog.location}</p>
      {/* Match Score */}
        <p className="text-sm text-blue-600 font-semibold mt-2">
          Match Score: {score} / 10
        </p>
      </div>

      <button className="mt-4 w-full py-2 px-4 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Express Interest
      </button>
    </div>
  );
}