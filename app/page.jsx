"use client"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import StrayShieldLogo from "@/components/StrayShieldLogo"
import { AlertCircle, Users, MapPin, Shield, ArrowRight } from 'lucide-react'

export default function Landing() {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Tracking",
      description: "Report stray dogs with precise location coordinates",
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Real-time Alerts",
      description: "Instant notifications for NGO responders",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Network",
      description: "Connect citizens with animal welfare organizations",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "Secure reporting with optional anonymity",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-blue-50/50 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <StrayShieldLogo size="lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Stray{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Shield</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Protect stray dogs in your community. Report sightings, connect with NGOs, and make a difference together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              Report a Stray <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/signup"              
              className="inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
            >
              Join as NGO
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Stray Shield?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-background hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50/50 to-blue-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Help?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you've spotted a stray dog or want to help as an NGO, join us in creating a safer community for
            animals.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
