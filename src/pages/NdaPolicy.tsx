
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { NdaHero } from "@/components/nda-policy/NdaHero";
import { NdaFeatures } from "@/components/nda-policy/NdaFeatures";
import { NdaCta } from "@/components/nda-policy/NdaCta";
import { NdaFaq } from "@/components/nda-policy/NdaFaq";

export const NdaPolicy = () => {
  return <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <div className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#13293D] via-[#16324F] to-[#0EA4E9] backdrop-blur-sm text-white rounded-lg shadow-xl p-8">
            <NdaHero />
            <NdaFeatures />
            <NdaCta />
            <NdaFaq />
          </div>
        </div>
        
        <Footer />
      </div>
    </div>;
};
export default NdaPolicy;
