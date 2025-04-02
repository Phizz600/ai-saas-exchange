
import { ConfidentialWatermark } from "@/components/marketplace/product-card/ConfidentialWatermark";

export const NdaHero = () => {
  return (
    <>
      <div className="relative">
        <h1 className="exo-2-heading text-4xl md:text-5xl font-bold text-white mb-4 my-[60px]">Enhanced NDA Policy</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6]"></div>
      </div>
      
      <p className="text-white/90 mt-8 text-lg">
        At AI Exchange Club, we understand that confidentiality is paramount when selling your AI business or product. 
        Our enhanced Non-Disclosure Agreement (NDA) system provides multiple layers of protection to ensure your 
        sensitive business information remains secure throughout the entire selling process.
      </p>

      {/* Hero section with image */}
      <div className="mt-12 relative rounded-xl overflow-hidden shadow-xl">
        <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200&h=600" alt="Secure digital technology" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/80 to-transparent flex items-center">
          <div className="p-8 md:p-16 max-w-lg">
            <h2 className="text-white text-3xl font-bold mb-4 exo-2-heading">Trusted by Industry Leaders</h2>
            <p className="text-white/90">
              Our NDA system is designed to meet industry standards and has been vetted by legal professionals 
              specializing in technology transactions.
            </p>
          </div>
        </div>
        {/* Subtle watermark for visual effect */}
        <ConfidentialWatermark text="SECURE" opacity={0.05} rotation={-45} />
      </div>
    </>
  );
};
