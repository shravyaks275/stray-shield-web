"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import StrayShieldLogo from "@/components/StrayShieldLogo"
import { AlertCircle, Users, MapPin, Shield, ArrowRight, CheckCircle2, Heart, Dog, Bone, PawPrint } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

export default function Landing() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -200])

  // Floating activity mockups
  const activities = [
    { title: "Rescue Operation", location: "Downtown Area", time: "2 mins ago" },
    { title: "New NGO Joined", location: "Paws Care", time: "15 mins ago" },
    { title: "Stray Tracked", location: "Westside Park", time: "1 hr ago" }
  ]
  const [activeNotification, setActiveNotification] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotification((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [activities.length])

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary overflow-hidden perspective-root">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-70"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[130px] mix-blend-screen opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

        {/* Floating Dog Icons Background */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] left-[10%] opacity-20 dark:opacity-30 z-10">
          <PawPrint className="w-40 h-40 text-primary z-20 opacity-90" />
        </motion.div>
        <motion.div animate={{ y: [0, 30, 0], rotate: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[55%] right-[5%] opacity-20 dark:opacity-30">
          <Dog className="w-56 h-56 text-indigo-500" />
        </motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[5%] left-[8%] opacity-20 dark:opacity-30">
          <Bone className="w-36 h-36 text-rose-600 z-20 opacity-90" />
        </motion.div>
        <motion.div animate={{ y: [0, -25, 0], rotate: [0, -15, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[20%] opacity-20 dark:opacity-30">
          <PawPrint className="w-32 h-32 text-primary z-20 opacity-90" />
        </motion.div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 min-h-[95vh] flex flex-col justify-center items-center">
        {/* Floating Mockups Background Layer */}
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none hidden lg:block">
          <motion.div style={{ y: y1 }} className="absolute top-[20%] left-[5%]">
            <div className="glass-panel p-4 rounded-3xl flex items-center gap-4 bg-background/60 backdrop-blur-2xl border border-white/20 shadow-2xl rotate-[-4deg] transition-transform hover:rotate-0 hover:scale-105">
              <div className="p-3 bg-red-500/10 rounded-2xl"><AlertCircle className="w-6 h-6 text-red-500" /></div>
              <div><p className="text-sm font-bold text-foreground">Urgent Report</p><p className="text-xs text-muted-foreground">High Street</p></div>
            </div>
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-[20%] right-[3%]">
            <div className="glass-panel p-4 rounded-3xl flex items-center gap-4 bg-background/60 backdrop-blur-2xl border border-white/20 shadow-2xl rotate-[5deg] transition-transform hover:rotate-0 hover:scale-105">
              <div className="p-3 bg-emerald-500/10 rounded-2xl"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
              <div><p className="text-sm font-bold text-foreground">Rescue Secured</p><p className="text-xs text-muted-foreground">NGO: Paws for Hope</p></div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="flex justify-center mb-10"
          >
            <div className="relative group perspective-1000">
              <motion.div
                whileHover={{ rotateY: 15, rotateX: -15, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-6 glass rounded-[2rem] shadow-2xl relative bg-background/50 border-white/20 dark:border-white/10 dark:bg-black/40 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl dark:from-primary/30 dark:to-indigo-500/30" />
                <div className="relative z-10"><StrayShieldLogo size="xl" /></div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground mb-6 tracking-tighter leading-[1.1] depth-layer">
              Protect the <br className="hidden md:block" />
              <span className="relative inline-block mt-2 md:mt-0">
                <span className="absolute inset-x-0 bottom-1 h-1/3 bg-primary/20 -z-10 rounded-md blur-xl" />
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-sm animate-gradient-x px-2">Unprotected</span>
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Real-time tracking and rescue coordination. Join thousands empowering swift responses for strays across the city.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/report"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-foreground text-background rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(var(--foreground),0.3)] hover:shadow-[0_0_60px_-15px_rgba(var(--foreground),0.5)] font-bold text-lg w-full sm:w-auto depth-layer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/20 skew-x-[45deg] group-hover:animate-shine" />
              <span className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Report a Stray <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/signup"
              className="group inline-flex items-center justify-center px-10 py-5 bg-background/50 backdrop-blur-md border-2 border-border text-foreground rounded-full transition-all hover:bg-muted font-bold text-lg w-full sm:w-auto hover:border-primary/50 shadow-sm depth-layer"
            >
              Join as Rescuer
            </Link>
          </motion.div>

          {/* Live Activity Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex justify-center"
          >
            <div className="inline-flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-border px-6 py-3 rounded-full shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <div className="flex text-sm text-foreground font-medium h-5 overflow-hidden min-w-[280px]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeNotification}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center gap-2 w-full whitespace-nowrap"
                  >
                    <span>{activities[activeNotification].title} in <span className="text-primary font-bold">{activities[activeNotification].location}</span></span>
                    <span className="text-muted-foreground text-xs ml-auto">({activities[activeNotification].time})</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-32 px-4 relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight">
            Intelligence for <span className="text-primary bg-primary/10 px-4 py-1 rounded-2xl">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">An interconnected ecosystem designed to accelerate rescues and empower communities instantly.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] lg:auto-rows-[350px]">
          {/* Main Feature - Spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 group relative rounded-[2.5rem] overflow-hidden bg-card border border-border p-8 lg:p-12 flex flex-col justify-end hover:border-primary/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-8 right-8 p-5 bg-primary/10 rounded-3xl backdrop-blur-md border border-primary/20 transform group-hover:-rotate-6 transition-transform">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <div className="relative z-10 w-full md:max-w-md">
              <h3 className="text-3xl lg:text-4xl font-black mb-4 tracking-tight">Precision Location Tracking</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Pinpoint reporting with interactive heatmaps. Responders receive exact coordinates, reducing search time significantly.</p>
            </div>
          </motion.div>

          {/* Feature 2 - Spans 1 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="md:col-span-1 group relative rounded-[2.5rem] overflow-hidden bg-card border border-border p-8 lg:p-10 flex flex-col justify-between hover:border-rose-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-500/5 group-hover:bg-rose-500/10 transition-colors duration-500" />
            <div className="p-4 bg-rose-500/10 rounded-3xl w-fit self-start text-rose-500 group-hover:scale-110 transition-transform"><AlertCircle className="w-8 h-8" /></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Real-time Alerts</h3>
              <p className="text-muted-foreground leading-relaxed">Instant notifications blast to the nearest verified organizations.</p>
            </div>
          </motion.div>

          {/* Feature 3 - Spans 1 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="md:col-span-1 group relative rounded-[2.5rem] overflow-hidden bg-card border border-border p-8 lg:p-10 flex flex-col justify-between hover:border-purple-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500" />
            <div className="p-4 bg-purple-500/10 rounded-3xl w-fit self-start text-purple-500 group-hover:scale-110 transition-transform"><Shield className="w-8 h-8" /></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">Anonymous reporting capabilities ensuring complete citizen privacy.</p>
            </div>
          </motion.div>

          {/* Feature 4 - Spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="md:col-span-2 group relative rounded-[2.5rem] overflow-hidden bg-card border border-border p-8 lg:p-12 flex flex-col justify-end hover:border-emerald-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-8 right-8 p-5 bg-emerald-500/10 rounded-3xl backdrop-blur-md border border-emerald-500/20 transform group-hover:rotate-6 transition-transform">
              <Users className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="relative z-10 md:max-w-md">
              <h3 className="text-3xl lg:text-4xl font-black mb-4 tracking-tight">Unifying the Community</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Bridging the gap between compassionate citizens and professional animal welfare experts in a seamless network.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 px-4 mb-10 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-800"
          >
            {/* Dark Mode Background base */}
            <div className="absolute inset-0 bg-black" />

            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />

            {/* Ambient gradients */}
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-primary/40 rounded-full blur-[120px] pointer-events-none mix-blend-plus-lighter" />
            <div className="absolute left-[-100px] top-[-100px] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px] pointer-events-none mix-blend-plus-lighter" />

            <div className="relative z-10 px-6 py-24 md:py-32 flex flex-col items-center text-center">
              <motion.span
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-8 backdrop-blur-md border border-white/20 flex gap-2 items-center"
              >
                <Heart className="w-4 h-4 text-rose-400" /> The Time is Now
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight max-w-3xl"
              >
                Ready to Make a <br /><span className="bg-gradient-to-r from-primary via-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">Real Difference?</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-xl text-zinc-300/80 mb-12 max-w-2xl font-medium"
              >
                Every second counts when a stray is in danger. Join our growing network and become a beacon of hope for animals today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link
                  href="/report"
                  className="group relative inline-flex items-center justify-center px-12 py-5 bg-white text-black rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">Report Sighting Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

