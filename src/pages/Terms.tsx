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
            Last Updated: 10-1-2025
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
                Welcome to the AI Exchange Club ("Platform," "we," "us," or "our"). We provide Deal Flow as a Service (DFAAS) to connect investors with AI SaaS investment opportunities. By accessing or using our platform, you agree to comply with these Terms and Conditions ("Terms"). If you disagree, do not use the Platform.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">1. Acceptance of Terms</h2>
              <p className="text-white/90">
                By using the Platform, you agree to these Terms and our Privacy Policy. We may update these Terms at any time. Continued use after changes constitutes acceptance.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">2. Definitions</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li><strong>Platform:</strong> Our Deal Flow as a Service (DFAAS) platform connecting investors with AI SaaS investment opportunities.</li>
                <li><strong>Investors:</strong> Venture capitalists and other qualified buyers seeking AI SaaS investment opportunities.</li>
                <li><strong>Entrepreneurs:</strong> AI SaaS founders and companies seeking investment or acquisition opportunities.</li>
                <li><strong>Deal Flow:</strong> Curated investment opportunities, market intelligence, and deal sourcing services.</li>
                <li><strong>Content:</strong> Listings, reviews, messages, deal information, or data uploaded to the Platform.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">3. Eligibility</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>You must be 18+ or the age of majority in your jurisdiction.</li>
                <li>Entrepreneurs must be authorized to represent their companies and provide accurate business information.</li>
                <li>Prohibited for sanctioned individuals or entities.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">4. Account Registration</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Provide accurate, current information.</li>
                <li>You are responsible for account security and activity.</li>
                <li>Do not share accounts or use bots for registration.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">5. Investor and Entrepreneur Responsibilities</h2>
              <p className="text-white/90 font-semibold">Entrepreneurs:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2 mb-4">
                <li>Accurately represent your AI SaaS business, including financials, metrics, and business model.</li>
                <li>Provide complete and truthful information about your company, technology, and market position.</li>
                <li>Disclose all material information that could affect investment decisions.</li>
                <li>Maintain confidentiality of sensitive business information as required.</li>
              </ul>
              <p className="text-white/90 font-semibold">Investors:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Conduct your own due diligence before making investment decisions.</li>
                <li>Comply with all applicable securities laws and regulations.</li>
                <li>Maintain confidentiality of proprietary information shared during the investment process.</li>
                <li>Use information obtained through the Platform solely for legitimate investment evaluation purposes.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">6. Intellectual Property (IP)</h2>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li><strong>Entrepreneur IP:</strong> Entrepreneurs retain ownership of their AI SaaS technology and intellectual property.</li>
                <li><strong>Platform IP:</strong> We own all platform content, technology, and branding.</li>
                <li><strong>User Content:</strong> You grant us a license to host, display, and use your content for deal flow purposes.</li>
                <li><strong>Confidential Information:</strong> All parties must maintain confidentiality of proprietary information shared during the investment process.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">7. Marketing and Promotional Rights</h2>
              <p className="text-white/90">
                By listing your AI SaaS business on the Platform, you grant AI Exchange Club a non-exclusive, royalty-free license to:
              </p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>Use your company name, description, logo, screenshots, and other listing content for deal flow marketing purposes.</li>
                <li>Promote your investment opportunity across our marketing channels, including but not limited to email newsletters, social media accounts, blogs, and partner websites.</li>
                <li>Feature your business in advertising materials both on and off our platform to attract qualified investors.</li>
                <li>Create and distribute promotional content highlighting your business and its investment potential to our investor network.</li>
              </ul>
              <p className="text-white/90 mt-2">
                This promotional license remains in effect for the duration of your listing and for a reasonable period thereafter for ongoing marketing campaigns. You may request the removal of specific marketing materials after your listing ends by contacting us directly.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">8. AI SaaS Investment Disclosure Requirements</h2>
              <p className="text-white/90">Transparency: Entrepreneurs must disclose:</p>
              <ul className="list-disc pl-6 text-white/90 space-y-2">
                <li>AI technology stack, models used, and data sources.</li>
                <li>Known risks, limitations, and potential biases in AI systems.</li>
                <li>Regulatory compliance and data privacy measures.</li>
                <li>Intellectual property ownership and third-party dependencies.</li>
                <li>Technical due diligence results and security audits.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">9. Disclaimers and Liability</h2>
              <p className="text-white/90">
                <strong>No Investment Advice:</strong> The Platform is provided "as-is." We do not provide investment advice, guarantee returns, or warrant the success of any investment opportunity. All investment decisions are made at your own risk.
              </p>
              <p className="text-white/90 mt-2">
                <strong>Due Diligence:</strong> Investors must conduct their own due diligence. We do not guarantee the accuracy of information provided by entrepreneurs or the success of any investment.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">10. Termination</h2>
              <p className="text-white/90">
                We may suspend/terminate accounts for violations. You may delete your account at any time.
              </p>


              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">11. Updates</h2>
              <p className="text-white/90">
                We will notify users of changes via email or in-platform alerts. Continued use = acceptance.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">12. Contact Us</h2>
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