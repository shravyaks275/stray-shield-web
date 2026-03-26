import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Activity, Syringe, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';

// Simple compatibility scoring function
export function calculateMatch(dog, user) {
    let score = 0;

    // Energy matching
    if (dog.traits?.energy === "high" && user.lifestyle === "active") score += 2;
    else if (dog.traits?.energy === "medium" && user.lifestyle === "moderate") score += 2;
    else if (dog.traits?.energy === "low" && user.lifestyle === "relaxed") score += 2;
    else if (dog.traits?.energy === "medium") score += 1;

    // Sociability
    if (dog.traits?.sociability === "friendly" && user.household !== "single") score += 2;
    else if (dog.traits?.sociability === "shy" && user.household === "single") score += 2;
    else if (dog.traits?.sociability === "friendly") score += 1;

    // Trainability
    if (dog.traits?.trainability === "easy" && user.experience === "beginner") score += 2;
    else if (dog.traits?.trainability === "moderate" && user.experience === "intermediate") score += 2;
    else if (dog.traits?.trainability === "hard" && user.experience === "expert") score += 2;
    else if (user.experience !== "beginner") score += 1;

    // Space vs Size
    if (dog.traits?.size === "small" && user.space === "apartment") score += 2;
    else if (dog.traits?.size === "medium" && user.space === "house") score += 2;
    else if (dog.traits?.size === "large" && user.space === "farm") score += 2;
    else if (user.space !== "apartment") score += 1;

    return score;
}

export default function DogCard({ dog, user }) {
    const [isExpanded, setIsExpanded] = useState(false);
    // Always have an array to map over
    const images = Array.isArray(dog.images) ? dog.images : [dog.image];
    const score = calculateMatch(dog, user); // Calculate compatibility score

    const getTypeIcon = (type) => {
        switch(type) {
            case "Vaccination": return <Syringe className="w-4 h-4 text-blue-500" />;
            case "Health Check": return <Stethoscope className="w-4 h-4 text-green-500" />;
            case "Treatment": return <Activity className="w-4 h-4 text-orange-500" />;
            case "Sterilization": return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
            default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <motion.div
            layout
            whileHover={!isExpanded ? { y: -8, scale: 1.02 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel rounded-3xl p-5 shadow-lg border border-white/20 flex flex-col relative overflow-hidden group w-full"
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

            <div className="flex flex-col gap-2 mt-4 relative z-10">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 px-4 bg-foreground text-background font-bold rounded-xl hover:shadow-[0_0_20px_-5px_rgba(var(--foreground),0.4)] transition-all"
                >
                    Express Interest
                </motion.button>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-2.5 px-4 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 hover:text-primary transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Activity className="w-4 h-4" />
                    {isExpanded ? "Hide Health Profile" : "View Health Profile"}
                </button>
            </div>

            {/* Modal Dialog Health Records Section */}
            <AnimatePresence>
                {isExpanded && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsExpanded(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-card border border-border/50 shadow-2xl rounded-3xl overflow-hidden max-h-[85vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-secondary/10">
                                <div>
                                    <h3 className="text-xl font-black text-foreground">{dog.name}'s Health Profile</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Medical history and vaccination records.</p>
                                </div>
                                <button 
                                    onClick={() => setIsExpanded(false)} 
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {dog.healthRecords && dog.healthRecords.length > 0 ? (
                                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
                                        {dog.healthRecords.map((record, i) => (
                                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-secondary text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[3px] md:mx-auto z-10">
                                                    {getTypeIcon(record.type)}
                                                </div>
                                                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] bg-background/50 border border-white/5 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between space-x-2 mb-3">
                                                        <div className="font-black text-foreground text-sm xl:text-base">{record.type}</div>
                                                        <div className="font-bold text-primary text-xs bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">{new Date(record.date).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="text-sm text-foreground/80 leading-relaxed mb-4">{record.notes}</div>
                                                    <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                        <Activity className="w-3.5 h-3.5" /> Administered by {record.by}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Activity className="w-8 h-8 text-muted-foreground opacity-50" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No medical records available for {dog.name} yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}