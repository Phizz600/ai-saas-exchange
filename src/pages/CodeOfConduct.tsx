import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function CodeOfConduct() {
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
              Code of Conduct
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
                  This Code of Conduct establishes the standards of behavior expected from all users of our Deal Flow as a Service (DFAAS) platform. By using our platform, you agree to uphold these principles and contribute to a professional, respectful, and productive environment.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">1. Professional Standards</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Business Conduct</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Maintain the highest standards of integrity and professionalism</li>
                  <li>Provide accurate and truthful information in all communications</li>
                  <li>Respect confidentiality and non-disclosure agreements</li>
                  <li>Act in the best interests of all parties involved</li>
                  <li>Uphold ethical business practices and legal compliance</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Communication Standards</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Use clear, professional language in all interactions</li>
                  <li>Respond promptly to inquiries and requests</li>
                  <li>Maintain respectful and constructive dialogue</li>
                  <li>Provide honest feedback and assessments</li>
                  <li>Keep sensitive information confidential</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">2. Respect and Inclusion</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Diversity and Inclusion</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Treat all users with respect regardless of background, identity, or beliefs</li>
                  <li>Foster an inclusive environment that welcomes diverse perspectives</li>
                  <li>Challenge bias and discrimination in all forms</li>
                  <li>Support equal opportunities for all participants</li>
                  <li>Celebrate diverse experiences and viewpoints</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Harassment and Discrimination</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Zero tolerance for harassment, bullying, or intimidation</li>
                  <li>No discrimination based on race, gender, age, religion, or other protected characteristics</li>
                  <li>Respect personal boundaries and privacy</li>
                  <li>Report inappropriate behavior immediately</li>
                  <li>Support those who experience harassment or discrimination</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">3. Information Integrity</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Accurate Information</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Provide truthful and accurate information in all listings and communications</li>
                  <li>Disclose all material facts that could affect investment decisions</li>
                  <li>Update information promptly when circumstances change</li>
                  <li>Correct any errors or misrepresentations immediately</li>
                  <li>Support claims with verifiable evidence</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Confidentiality</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Respect the confidentiality of sensitive business information</li>
                  <li>Use information only for legitimate business purposes</li>
                  <li>Protect intellectual property and trade secrets</li>
                  <li>Maintain confidentiality even after relationships end</li>
                  <li>Report any suspected breaches of confidentiality</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">4. Conflict of Interest</h2>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Disclose any potential conflicts of interest</li>
                  <li>Avoid situations where personal interests conflict with professional duties</li>
                  <li>Recuse yourself from decisions where conflicts exist</li>
                  <li>Seek guidance when conflicts are unclear</li>
                  <li>Prioritize the interests of all parties involved</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">5. Platform Usage</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Appropriate Use</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Use the platform only for legitimate business purposes</li>
                  <li>Respect the platform's terms of service and guidelines</li>
                  <li>Do not attempt to circumvent platform security or restrictions</li>
                  <li>Report technical issues or security concerns</li>
                  <li>Use platform resources responsibly and efficiently</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Prohibited Activities</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>No spam, phishing, or fraudulent activities</li>
                  <li>No unauthorized access to other users' accounts or information</li>
                  <li>No distribution of malware or harmful software</li>
                  <li>No violation of intellectual property rights</li>
                  <li>No activities that could harm the platform or its users</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">6. Investment Practices</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Due Diligence</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Conduct thorough due diligence before making investment decisions</li>
                  <li>Verify information independently when possible</li>
                  <li>Seek professional advice when appropriate</li>
                  <li>Make informed decisions based on available information</li>
                  <li>Understand the risks involved in any investment</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Transparency</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Be transparent about your investment criteria and process</li>
                  <li>Communicate clearly about your expectations and requirements</li>
                  <li>Provide honest feedback about opportunities</li>
                  <li>Maintain open and honest communication throughout the process</li>
                  <li>Respect the time and effort of all parties involved</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">7. Compliance and Legal</h2>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respect securities laws and investment regulations</li>
                  <li>Maintain proper documentation and records</li>
                  <li>Report any suspected illegal activities</li>
                  <li>Cooperate with legal investigations when required</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">8. Reporting Violations</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">How to Report</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Report violations immediately to our support team</li>
                  <li>Provide detailed information about the incident</li>
                  <li>Include any relevant documentation or evidence</li>
                  <li>Maintain confidentiality of the reporting process</li>
                  <li>Cooperate with investigations when requested</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Investigation Process</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>All reports are investigated promptly and thoroughly</li>
                  <li>Confidentiality is maintained throughout the process</li>
                  <li>Appropriate action is taken based on findings</li>
                  <li>Parties are notified of outcomes when appropriate</li>
                  <li>Retaliation against reporters is strictly prohibited</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">9. Consequences of Violations</h2>
                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Disciplinary Actions</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Warning and education for minor violations</li>
                  <li>Temporary suspension for repeated or serious violations</li>
                  <li>Permanent ban for severe or repeated violations</li>
                  <li>Legal action for criminal activities</li>
                  <li>Cooperation with law enforcement when required</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">Appeal Process</h3>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Users may appeal disciplinary actions</li>
                  <li>Appeals must be submitted within 30 days</li>
                  <li>Independent review of appeals when appropriate</li>
                  <li>Final decisions are binding</li>
                  <li>Process is fair and transparent</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">10. Continuous Improvement</h2>
                <ul className="list-disc pl-6 text-white/90 space-y-2">
                  <li>Regular review and updates of this Code of Conduct</li>
                  <li>User feedback incorporated into improvements</li>
                  <li>Training and education programs for users</li>
                  <li>Best practices shared across the community</li>
                  <li>Commitment to maintaining high standards</li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">11. Contact Information</h2>
                <p className="text-white/90">
                  To report violations or ask questions about this Code of Conduct:
                </p>
                <p className="text-white/90 font-bold mt-2">AI Exchange Club</p>
                <p className="text-white/90">
                  <a href="mailto:aiexchangeclub@gmail.com" className="text-[#0EA4E9] hover:underline">aiexchangeclub@gmail.com</a>
                </p>
                <p className="text-white/90 mt-4">
                  Please include "Code of Conduct" in your email subject line for appropriate routing.
                </p>

                <h2 className="text-2xl font-semibold text-white mt-8 mb-4 exo-2-heading">12. Acknowledgment</h2>
                <p className="text-white/90">
                  By using our platform, you acknowledge that you have read, understood, and agree to abide by this Code of Conduct. Violations may result in disciplinary action, including suspension or termination of your account.
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
