
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubmissionAgreementsProps {
  form: UseFormReturn<ListProductFormData>;
}

export function SubmissionAgreements({ form }: SubmissionAgreementsProps) {
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700">Submission Agreements</h3>
      
      <FormField
        control={form.control}
        name="accuracyAgreement"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormControl>
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="accuracyAgreement"
                  className="mt-1"
                />
                <FormLabel htmlFor="accuracyAgreement" className="text-sm leading-relaxed text-gray-600 text-left">
                  I confirm that I will complete this form thoroughly and accurately to the best of my ability. I understand that comprehensive and precise information significantly enhances my listing's credibility and increases the likelihood of attracting serious buyers and investors.
                </FormLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="termsAgreement"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormControl>
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="termsAgreement"
                  className="mt-1"
                />
                <FormLabel htmlFor="termsAgreement" className="text-sm leading-relaxed text-gray-600 text-left flex items-center gap-1">
                  I agree to the
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="h-auto p-0 text-[#8B5CF6] whitespace-nowrap">
                        Terms and Conditions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl mb-4">Terms and Conditions</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto pr-4">
                        <div className="prose prose-sm">
                          <p className="text-gray-500 mb-4">Last Updated: 03-03-2025</p>
                          
                          <p className="mb-4">Welcome to the AI Exchange Club ("Marketplace," "we," "us," or "our"). By accessing or using our platform, you agree to comply with these Terms and Conditions ("Terms"). If you disagree, do not use the Marketplace.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
                          <p>By using the Marketplace, you agree to these Terms and our Privacy Policy. We may update these Terms at any time. Continued use after changes constitutes acceptance.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">2. Definitions</h2>
                          <p>Marketplace: The platform connecting buyers and sellers of AI tools/services.</p>
                          <p>Buyers: Users purchasing AI tools/services.</p>
                          <p>Sellers: Users listing AI tools/services.</p>
                          <p>Content: Listings, reviews, messages, or data uploaded to the Marketplace.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">3. Eligibility</h2>
                          <p>You must be 18+ or the age of majority in your jurisdiction.</p>
                          <p>Prohibited for sanctioned individuals or entities.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">4. Account Registration</h2>
                          <p>Provide accurate, current information.</p>
                          <p>You are responsible for account security and activity.</p>
                          <p>Do not share accounts or use bots for registration.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">5. Buyer and Seller Responsibilities</h2>
                          <p className="font-medium">Sellers:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Accurately represent AI tools/services (e.g., capabilities, limitations).</li>
                            <li>Disclose use of third-party APIs, open-source models, or proprietary IP.</li>
                            <li>Prohibited: Illegal, harmful, or unethical tools (e.g., deepfakes, spam generators).</li>
                          </ul>
                          <p className="font-medium">Buyers:</p>
                          <p>Use purchased tools lawfully.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">6. Listings and Transactions</h2>
                          <p className="mb-2">Listings: Must include clear descriptions, pricing, and technical requirements.</p>
                          <p className="mb-2">Transactions: Processed via [Escrow.com/Stripe/Payment Processor].</p>
                          
                          <p className="font-medium mt-4">Fees: Tiered Success Fee Structure (0 to $100,000+)</p>
                          <div className="overflow-x-auto">
                            <table className="min-w-full mb-4">
                              <thead>
                                <tr>
                                  <th className="text-left py-2">Final Selling Price</th>
                                  <th className="text-left py-2">Success Fee</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr><td>0−500</td><td>10%</td></tr>
                                <tr><td>501−2,000</td><td>8%</td></tr>
                                <tr><td>2,001−10,000</td><td>6%</td></tr>
                                <tr><td>10,001−50,000</td><td>4%</td></tr>
                                <tr><td>50,001−100,000</td><td>2%</td></tr>
                                <tr><td>$100,001+</td><td>1%</td></tr>
                              </tbody>
                            </table>
                          </div>

                          <p className="font-medium">Additional Fees:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Payment Processing: 2.9% + $0.30 (charged by Stripe)</li>
                            <li>Escrow fees</li>
                            <li>Listing Fee: $100 per listing (Reduced to $10 for early adopters)</li>
                          </ul>

                          <h2 className="text-lg font-semibold mt-6 mb-2">7. Intellectual Property (IP)</h2>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Seller IP: Sellers retain ownership of their AI tools.</li>
                            <li>Marketplace IP: We own all platform content (e.g., code, branding).</li>
                            <li>User Content: You grant us a license to host and display your content.</li>
                          </ul>

                          <h2 className="text-lg font-semibold mt-6 mb-2">8. AI-Specific Rules</h2>
                          <p className="font-medium">Transparency: Sellers must disclose:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Whether AI outputs are human-reviewed.</li>
                            <li>Known risks (e.g., biases, inaccuracies).</li>
                          </ul>

                          <h2 className="text-lg font-semibold mt-6 mb-2">9. Disclaimers and Liability</h2>
                          <p>No Warranty: The Marketplace is provided "as-is." We do not guarantee accuracy, uptime, or safety.</p>
                          
                          <h2 className="text-lg font-semibold mt-6 mb-2">10. Termination</h2>
                          <p>We may suspend/terminate accounts for violations. You may delete your account at any time.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">11. Governing Law</h2>
                          <p>These Terms shall be governed by the laws of the State of Minnesota, United States.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">12. Dispute Resolution</h2>
                          <p className="font-medium">a. Binding Arbitration</p>
                          <p>Disputes shall be resolved by binding arbitration administered by the American Arbitration Association (AAA).</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">13. Updates</h2>
                          <p>We will notify users of changes via email or in-platform alerts. Continued use = acceptance.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">14. Contact Us</h2>
                          <p>For questions or disputes:</p>
                          <p>AI Exchange Club</p>
                          <p>aiexchangeclub@gmail.com</p>

                          <p className="mt-6 text-sm text-gray-500">Privacy Policy: Review our Privacy Policy for data practices.</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </FormLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
