import React from "react";
import Navbar from "@/components/Landing/Navbar";
import Hero from "@/components/Landing/Hero";
import HowToUse from "@/components/Landing/HowToUse";
import Presets from "@/components/Landing/Presets";
import Creators from "@/components/Landing/Creators";
import Footer from "@/components/Landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main>
        <Hero />
        <HowToUse />
        <Presets />
        <Creators />
      </main>
      <Footer />
    </div>
  );
}
