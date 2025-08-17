import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
export function Terms() {
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
  return <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <PromotionalBanner />
        <Navbar />
        
        <div className="pt-24 pb-16 py-0">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container mx-auto px-4 text-center mb-12 my-[50px]">
          <h1 className="exo-2-heading text-5xl font-bold text-white mb-4 bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] inline-block text-transparent bg-clip-text">
            Terms and Conditions
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Last Updated: 03-03-2025
          </p>
        </motion.div>

        <motion.div className="container mx-auto px-4 mt-10" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3,
          duration: 0.6
        }}>
          <Card className="bg-white/10 backdrop-blur-sm border-white/5 p-8 rounded-xl">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-white/90">
                Welcome to the AI Exchange Club ("Marketplace," "we," "us," or "our"). By accessing or using our platform, you agree to comply with these Terms and Conditions ("Terms"). If you disagree, do not use the Marketplace.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">1. Acceptance of Terms</h2>
              <p className="text-white/90">
                By using the Marketplace, you agree to these Terms and our Privacy Policy. We may update these Terms at any time. Continued use after changes constitutes acceptance.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">2. Definitions</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li><strong>Marketplace:</strong> The platform connecting buyers and sellers of AI tools/services.</li>
                <li><strong>Buyers:</strong> Users purchasing AI tools/services.</li>
                <li><strong>Sellers:</strong> Users listing AI tools/services.</li>
                <li><strong>Content:</strong> Listings, reviews, messages, or data uploaded to the Marketplace.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">3. Eligibility</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>You must be 18+ or the age of majority in your jurisdiction.</li>
                <li>Prohibited for sanctioned individuals or entities.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">4. Account Registration</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Provide accurate, current information.</li>
                <li>You are responsible for account security and activity.</li>
                <li>Do not share accounts or use bots for registration.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">5. Buyer and Seller Responsibilities</h2>
              <p className="text-white/90 font-semibold">Sellers:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2 mb-4">
                <li>Accurately represent AI tools/services (e.g., capabilities, limitations).</li>
                <li>Disclose use of third-party APIs, open-source models, or proprietary IP.</li>
                <li>Prohibited: Illegal, harmful, or unethical tools (e.g., deepfakes, spam generators).</li>
              </ul>
              <p className="text-white/90 font-semibold">Buyers:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Use purchased tools lawfully.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">6. Listings and Transactions</h2>
              <p className="text-white/90 mb-2"><strong>Listings:</strong> Must include clear descriptions, pricing, and technical requirements.</p>
              <p className="text-white/90 mb-2"><strong>Transactions:</strong> Processed via [Escrow.com/Stripe/Payment Processor].</p>
              
              <p className="text-white/90 font-semibold mt-4 mb-2">Fees: Tiered Success Fee Structure</p>
              
              <div className="overflow-x-auto mb-6">
                <Table className="w-full">
                  <TableHeader className="bg-white/10">
                    <TableRow>
                      <TableHead className="text-white font-semibold">Final Selling Price</TableHead>
                      <TableHead className="text-white font-semibold">Success Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$0 - $10,000</TableCell>
                      <TableCell className="text-white/90">10%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$10,001 - $50,000</TableCell>
                      <TableCell className="text-white/90">8%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$50,001 - $100,000</TableCell>
                      <TableCell className="text-white/90">6%</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-white/5 transition-colors">
                      <TableCell className="text-white/90 font-medium">$100,001+</TableCell>
                      <TableCell className="text-white/90">5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <p className="text-white/90 font-semibold">Additional Fees:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Payment Processing: 2.9% + $0.30 (charged by Stripe)</li>
                <li>Escrow fees</li>
                <li>Listing Fee: $100 per listing (Reduced to $10 for early adopters)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">7. Intellectual Property (IP)</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li><strong>Seller IP:</strong> Sellers retain ownership of their AI tools.</li>
                <li><strong>Marketplace IP:</strong> We own all platform content (e.g., code, branding).</li>
                <li><strong>User Content:</strong> You grant us a license to host and display your content.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">8. Marketing and Promotional Rights</h2>
              <p className="text-white/90">
                By listing your product on the Marketplace, you grant AI Exchange Club a non-exclusive, royalty-free license to:
              </p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Use your product name, description, logo, screenshots, and other listing content for marketing purposes.</li>
                <li>Promote your listed product across our marketing channels, including but not limited to email newsletters, social media accounts, blogs, and partner websites.</li>
                <li>Feature your product in advertising materials both on and off our platform.</li>
                <li>Create and distribute promotional content highlighting your business and its features to potential buyers.</li>
              </ul>
              <p className="text-white/90 mt-2">
                This promotional license remains in effect for the duration of your listing and for a reasonable period thereafter for ongoing marketing campaigns. You may request the removal of specific marketing materials after your listing ends by contacting us directly.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">9. AI-Specific Rules</h2>
              <p className="text-white/90">Transparency: Sellers must disclose:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Whether AI outputs are human-reviewed.</li>
                <li>Known risks (e.g., biases, inaccuracies).</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">10. Disclaimers and Liability</h2>
              <p className="text-white/90">
                <strong>No Warranty:</strong> The Marketplace is provided "as-is." We do not guarantee accuracy, uptime, or safety.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">11. Termination</h2>
              <p className="text-white/90">
                We may suspend/terminate accounts for violations. You may delete your account at any time.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">12. Governing Law</h2>
              <p className="text-white/90">
                These Terms shall be governed by the laws of the State of Minnesota, United States.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">13. Dispute Resolution</h2>
              <p className="text-white/90">
                <strong>a. Binding Arbitration</strong>
              </p>
              <p className="text-white/90">
                Disputes shall be resolved by binding arbitration administered by the American Arbitration Association (AAA).
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">14. Updates</h2>
              <p className="text-white/90">
                We will notify users of changes via email or in-platform alerts. Continued use = acceptance.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">15. Contact Us</h2>
              <p className="text-white/90">
                For questions or disputes:
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
    </div>;
}