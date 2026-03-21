import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

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
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-3xl p-5 shadow-lg border border-white/20 flex flex-col relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Swiper for images */}
      <div className="relative w-full h-56 mb-5 rounded-2xl overflow-hidden shadow-inner">
        <Swiper
          className="dog-swiper w-full h-full"
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          modules={[Navigation, Pagination]}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`${dog.name}-${index}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex-1 px-1 relative z-10">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-2xl font-black text-foreground tracking-tight">{dog.name}</h2>
          <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            Match: {score}/10
          </div>
        </div>
        
        <p className="text-sm text-foreground/80 font-medium mb-3">
          {dog.breed} <span className="mx-1 opacity-50">•</span> {dog.age} <span className="mx-1 opacity-50">•</span> {dog.sex}
        </p>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/40 backdrop-blur-sm rounded-lg border border-border/50 text-xs text-muted-foreground font-medium w-full">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate">{dog.location}</span>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 w-full py-3.5 px-4 bg-foreground text-background font-bold rounded-xl hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.4)] transition-all relative z-10"
      >
        Express Interest
      </motion.button>
    </motion.div>
  );
}