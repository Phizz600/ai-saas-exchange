import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
export function FAQ() {
  return <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        <div className="container mx-auto px-4 py-12 mt-16">
        <h1 className="text-3xl font-bold mb-8 exo-2-heading text-slate-50">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">What is AI Exchange?</h3>
            <p className="text-gray-700">
              AI Exchange is a marketplace for buying and selling AI-powered businesses and products.
              We connect AI builders with investors and acquirers looking for opportunities in the AI space.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">How do I list my AI product?</h3>
            <p className="text-gray-700">
              To list your AI product, simply click on the "List Product" button in the navigation menu
              and follow the guided process to create your listing.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">How does the escrow process work?</h3>
            <p className="text-gray-700">
              Our escrow process ensures safe transactions by holding funds until all conditions
              are met. When a buyer makes an offer, funds are placed in escrow until the seller
              delivers the agreed-upon assets and both parties confirm the transaction is complete.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">What types of AI products can I find?</h3>
            <p className="text-gray-700">
              You can find a wide range of AI products on our platform, including SaaS applications,
              AI models, algorithms, chatbots, computer vision solutions, and AI-integrated businesses.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-2">How are products verified?</h3>
            <p className="text-gray-700">
              Products can undergo verification for revenue, code quality, and traffic claims.
              Verified products display badges indicating which aspects have been independently verified.
            </p>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    </div>;
}