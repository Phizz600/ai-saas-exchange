
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const About = () => {
  return <div className="min-h-screen bg-gradient-to-br from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8">
          <h1 className="exo-2-heading text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">
            About AI Exchange Club
          </h1>
          <div className="space-y-6 text-gray-700">
            <p className="text-lg">AI Exchange Club is the premier marketplace for buying and selling AI-powered SaaS businesses. 


We connect innovative AI entrepreneurs with forward-thinking investors, creating opportunities for both sellers to realize the value of their creation and buyers to acquire cutting-edge AI technology businesses.
          </p>
            <p className="text-lg">
              Our platform provides a secure, transparent, and efficient marketplace where:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sellers can showcase their AI businesses to qualified buyers</li>
              <li>Buyers can discover vetted AI businesses with proven potential</li>
              <li>Both parties benefit from our streamlined valuation and transaction process</li>
              <li>Expert support ensures smooth and secure transactions</li>
            </ul>
            <p className="text-lg">
              Whether you're looking to sell your AI business or invest in the future of technology, 
              AI Exchange Club provides the platform, tools, and expertise you need to succeed.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default About;
