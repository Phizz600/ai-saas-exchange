
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";

export function About() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <h1 className="exo-2-heading text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#8B5CF6] via-[#D946EE] to-[#8B5CF6] bg-clip-text text-transparent">
              About AI Exchange
            </h1>
            
            <div className="prose max-w-none space-y-8">
              <p className="text-lg leading-relaxed text-gray-800">
                AI Exchange is the premier marketplace for buying and selling AI-powered businesses and products.
                We provide a secure, transparent platform connecting AI builders with investors and acquirers
                looking for opportunities in the rapidly evolving AI ecosystem.
              </p>
              
              <div>
                <h2 className="exo-2-heading text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
                <p className="text-gray-700">
                  Our mission is to accelerate innovation in the AI space by creating a trusted marketplace
                  where builders can monetize their creations and buyers can discover vetted, high-quality
                  AI assets with confidence.
                </p>
              </div>
              
              <div>
                <h2 className="exo-2-heading text-2xl font-semibold mb-4 text-gray-800">Our Vision</h2>
                <p className="text-gray-700">
                  We envision a world where AI builders can efficiently capture the value of their work,
                  and where acquiring AI capabilities is as straightforward as any other business transaction.
                  By reducing friction in the AI marketplace, we aim to fuel the next wave of AI innovation.
                </p>
              </div>
              
              <div>
                <h2 className="exo-2-heading text-2xl font-semibold mb-4 text-gray-800">Our Values</h2>
                <ul className="list-none space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] flex-shrink-0 mt-1 mr-3"></div>
                    <div>
                      <strong>Trust and Security:</strong> We prioritize the protection of intellectual property and ensure secure transactions.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] flex-shrink-0 mt-1 mr-3"></div>
                    <div>
                      <strong>Transparency:</strong> We provide clear, verified information to help make informed decisions.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] flex-shrink-0 mt-1 mr-3"></div>
                    <div>
                      <strong>Innovation:</strong> We continuously improve our platform to better serve the evolving AI ecosystem.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] flex-shrink-0 mt-1 mr-3"></div>
                    <div>
                      <strong>Accessibility:</strong> We make buying and selling AI assets accessible to businesses of all sizes.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="exo-2-heading text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
                <p className="text-gray-700">
                  Have questions or feedback? We'd love to hear from you. Visit our{" "}
                  <a href="/contact" className="text-[#8B5CF6] hover:text-[#D946EE] transition-colors">
                    contact page
                  </a>{" "}
                  to get in touch with our team.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
