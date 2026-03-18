"use client"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import StrayShieldLogo from "@/components/StrayShieldLogo"
import { AlertCircle, Users, MapPin, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'
import { motion } from "framer-motion"

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Tracking",
      description: "Report stray dogs with pinpoint precision anywhere in the city.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Real-time Alerts",
      description: "Send instant notifications to nearby registered NGO responders.",
      color: "from-rose-500 to-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Network",
      description: "Unite compassionate citizens with expert animal welfare organizations.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "Secure, reliable, and optionally anonymous reporting for your peace of mind.",
      color: "from-purple-500 to-indigo-500"
    },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50 pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="p-4 glass rounded-3xl shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <StrayShieldLogo size="lg" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tight"
          >
            Stray{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-blue-500 bg-clip-text text-transparent">Shield</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            Empower your community. Report sightings instantly, connect with verified NGOs, and give stray dogs the protection they deserve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/report"
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.7)] font-bold text-lg"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-2xl opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
              <span className="relative flex items-center gap-2">
                Report a Stray <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-background border-2 border-border text-foreground hover:bg-muted rounded-2xl transition-all hover:scale-105 font-bold text-lg shadow-sm"
            >
              Join as NGO
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium"
          >
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to use</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time tracking</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure platform</div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Why Choose Stray Shield?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Built with cutting-edge technology to ensure the fastest response for animals in need.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 glass rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-panel p-16 rounded-[40px] border border-white/20 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight">Ready to Impact Lives?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of responsible citizens and NGOs working together to create a safer, kinder community for every stray.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-12 py-5 bg-foreground text-background rounded-full hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.8)] transition-all hover:scale-105 font-bold text-xl"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
