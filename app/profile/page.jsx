"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUserProfile, updateUserProfile } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, Activity, Camera, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const [userType, setUserType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    address: "123 Green Street, Bangalore",
    bio: "Animal lover and software engineer."
  });

  const [activityData, setActivityData] = useState(() => {
    const data = [];
    const now = new Date();
    const mockValues = [45, 20, 60, 85, 30, 75]; // baseline dummy data
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        month: d.toLocaleString('default', { month: 'short' }),
        value: mockValues[5 - i],
        percentage: mockValues[5 - i]
      });
    }
    return data;
  });

  useEffect(() => {
    // Load profile data
    const fetchProfile = async () => {
      try {
        const type = localStorage.getItem("userType");
        setUserType(type);

        const res = await getUserProfile();

        if (res && res.user) {
          setProfile({
            name: res.user.name || "User",
            email: res.user.email || "",
            phone: res.user.phone || "",
            address: res.user.address || "",
            bio: type === "ngo"
              ? (res.user.organization_name || "")
              : "Active volunteer and dog lover."
          });

          const savedAvatar = localStorage.getItem("userAvatar");

          if (savedAvatar) {
            setAvatar(savedAvatar);
          } else if (res.user.avatar) {
            setAvatar(res.user.avatar);
          }
        }

      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("SAVE CLICKED");

    setLoading(true);

    try {
      const userId = Number(localStorage.getItem("userId"));

      if (!userId) {
        console.error("User ID missing");
        return;
      }

      const res = await updateUserProfile({
        ...profile,
        userId,
      });

      console.log("Response:", res);

      if (res?.success) {
        setProfile(prev => ({ ...prev, ...res.user }));
      }

    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
      setIsEditing(false); //  always collapse
    }
  };

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient background matching Stray Shield aesthetics */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-50" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-50" />

        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Profile</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">Manage your personal information and view your activity.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="glass-panel border border-white/10 rounded-[2rem] p-8 relative overflow-hidden text-center flex flex-col items-center">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/30 to-indigo-500/20" />

                <div className="relative z-10 w-32 h-32 mt-4 mb-6 rounded-full p-1 bg-background shadow-2xl">
                  <div className="w-full h-full bg-secondary/50 rounded-full flex items-center justify-center overflow-hidden border border-white/10 group">
                    {/* Mock Avatar */}
                    <img
                      src={avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=strayshield"}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAvatar(reader.result);
                              localStorage.setItem("userAvatar", reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-foreground relative z-10">{profile.name}</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mt-2 relative z-10 mb-4">
                  {userType === "ngo" ? "NGO Administrator" : "Citizen | Adopter"}
                </span>

                <p className="text-muted-foreground text-sm font-medium relative z-10">
                  {profile.bio}
                </p>
              </div>
            </motion.div>

            {/* Right Column: Edit Form & Activity Graph */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Profile Details Form */}
              <div className="glass-panel border border-white/10 rounded-[2rem] p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Personal Details
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-secondary/30 hover:bg-secondary/50 rounded-xl transition-colors text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full h-px bg-border my-4"></div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-extrabold text-muted-foreground uppercase mb-2 block">Full Name</label>
                    <input
                      type="text" name="name"
                      value={profile.name} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-background/50 border border-grey/10 rounded-md px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-muted-foreground uppercase mb-2 block">Email Address</label>
                    <input
                      type="email" name="email"
                      value={profile.email} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-background/50 border border-grey/10 rounded-md px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-muted-foreground uppercase mb-2 block">Phone Number</label>
                    <input
                      type="text" name="phone"
                      value={profile.phone} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-background/50 border border-grey/10 rounded-md px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-muted-foreground uppercase mb-2 block">Address / Location</label>
                    <input
                      type="text" name="address"
                      value={profile.address} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-background/50 border border-grey/10 rounded-md px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-muted-foreground uppercase mb-2 block">Bio</label>
                    <textarea
                      name="bio" rows="3"
                      value={profile.bio} onChange={handleChange} disabled={!isEditing}
                      className="w-full bg-background/50 border border-grey/10 rounded-md px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none disabled:opacity-70 disabled:cursor-not-allowed"
                    ></textarea>
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mt-6 flex justify-end overflow-hidden"
                    >
                      <button
                        onClick={handleSave} disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all disabled:opacity-70"
                      >
                        {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Minimal Activity Graph */}
              <div className="glass-panel border border-white/10 rounded-[2rem] p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" /> Platform Activity
                  </h3>
                  <span className="text-xs font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">Last 6 Months</span>
                </div>

                <div className="flex items-end justify-between h-48 gap-2 px-4 pb-2 border-b border-white/10">
                  {activityData.map((data, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group w-1/6">
                      <div className="w-full max-w-[40px] relative flex justify-center h-40 items-end">
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap">
                          {data.value} {userType === "ngo" ? "Adoptions" : "Reports"}
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${20 + i * 15}%` }}
                          className="w-full bg-primary/50 rounded-t"
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground font-medium mt-6">
                  {userType === "ngo" ? "Your rescues and adoptions make a real difference." : "Your reports help Stray Shield save more dogs every month."}
                </p>
              </div>

            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
