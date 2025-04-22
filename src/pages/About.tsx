
import { Header } from "@/components/Header";

export function About() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 mt-16">
        <h1 className="text-3xl font-bold mb-6 exo-2-heading">About AI Exchange</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed">
            AI Exchange is the premier marketplace for buying and selling AI-powered businesses and products.
            We provide a secure, transparent platform connecting AI builders with investors and acquirers
            looking for opportunities in the rapidly evolving AI ecosystem.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to accelerate innovation in the AI space by creating a trusted marketplace
            where builders can monetize their creations and buyers can discover vetted, high-quality
            AI assets with confidence.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p>
            We envision a world where AI builders can efficiently capture the value of their work,
            and where acquiring AI capabilities is as straightforward as any other business transaction.
            By reducing friction in the AI marketplace, we aim to fuel the next wave of AI innovation.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 my-4">
            <li><strong>Trust and Security:</strong> We prioritize the protection of intellectual property and ensure secure transactions.</li>
            <li><strong>Transparency:</strong> We provide clear, verified information to help make informed decisions.</li>
            <li><strong>Innovation:</strong> We continuously improve our platform to better serve the evolving AI ecosystem.</li>
            <li><strong>Accessibility:</strong> We make buying and selling AI assets accessible to businesses of all sizes.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you. Reach out to our team at 
            contact@aiexchange.com.
          </p>
        </div>
      </div>
    </>
  );
}
