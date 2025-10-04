import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Link } from "react-router-dom";
export function Policies() {
  return <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        <div className="container mx-auto px-4 mt-16 py-0">
        <h1 className="text-3xl font-bold mb-8 exo-2-heading text-slate-50">Policies</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">Privacy Policy</h3>
            <p className="text-gray-700 mb-4">
              Our Privacy Policy details how we collect, use, and protect your personal information
              when you use our platform.
            </p>
            <Link to="/privacy-policy" className="text-[#8B5CF6] hover:text-[#D946EE] font-medium transition-colors">
              Read Privacy Policy →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">NDA Policy</h3>
            <p className="text-gray-700 mb-4">
              Our NDA Policy explains how we protect confidential information when buyers
              view sensitive product details.
            </p>
            <Link to="/nda-policy" className="text-[#8B5CF6] hover:text-[#D946EE] font-medium transition-colors">
              Read NDA Policy →
            </Link>
          </div>
          
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">Code of Conduct</h3>
            <p className="text-gray-700 mb-4">
              Our Code of Conduct outlines the standards of behavior expected from all users
              of our platform.
            </p>
            <Link to="/code-of-conduct" className="text-[#8B5CF6] hover:text-[#D946EE] font-medium transition-colors">
              Read Code of Conduct →
            </Link>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    </div>;
}