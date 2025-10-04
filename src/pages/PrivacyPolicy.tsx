import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function PrivacyPolicy() {
  // Animation variants
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        
        <div className="pt-24 pb-16 py-0">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            className="container mx-auto px-4 text-center mb-12 my-[50px]"
          >
            <h1 className="exo-2-heading text-5xl font-bold text-white mb-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] inline-block text-transparent bg-clip-text">
              Privacy Policy
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto">
              Last Updated: 10-1-2025
            </p>
          </motion.div>

          <motion.div 
            className="container mx-auto px-4 mt-10" 
            initial={{
              opacity: 0,
              y: 30
            }} 
            animate={{
              opacity: 1,
              y: 0
            }} 
            transition={{
              delay: 0.3,
              duration: 0.6
            }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/5 p-8 rounded-xl">
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-white/90">
                  At AI Exchange Club, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our Deal Flow as a Service (DFAAS) platform.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">1. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Professional information (company, job title, industry)</li>
                  <li>Investment preferences and criteria</li>
                  <li>Business information for entrepreneurs</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Technical Information</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and platform interactions</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Provide and improve our DFAAS platform services</li>
                  <li>Match investors with relevant AI SaaS opportunities</li>
                  <li>Facilitate communication between parties</li>
                  <li>Send important updates and notifications</li>
                  <li>Analyze platform usage to enhance user experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">3. Information Sharing</h2>
                <p className="text-white/90 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To facilitate legitimate business transactions</li>
                  <li>With trusted service providers who assist our operations</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">4. Data Security</h2>
                <p className="text-white/90 mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication systems</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">5. Your Rights</h2>
                <p className="text-white/90 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability for your information</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">6. Cookies and Tracking</h2>
                <p className="text-white/90 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Essential cookies for platform functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Marketing cookies for relevant content delivery</li>
                  <li>You can manage cookie preferences in your browser settings</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">7. Data Retention</h2>
                <p className="text-white/90">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will remove your personal information within 30 days, unless we are required to retain it for legal or regulatory purposes.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">8. International Transfers</h2>
                <p className="text-white/90">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">9. Children's Privacy</h2>
                <p className="text-white/90">
                  Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">10. Changes to This Policy</h2>
                <p className="text-white/90">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our platform. Your continued use of our services constitutes acceptance of the updated policy.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">11. Contact Us</h2>
                <p className="text-white/90">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <p className="text-white/90 font-bold mt-2">AI Exchange Club</p>
                <p className="text-white/90">
                  <a href="mailto:aiexchangeclub@gmail.com" className="text-[#0EA4E9] hover:underline">aiexchangeclub@gmail.com</a>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
