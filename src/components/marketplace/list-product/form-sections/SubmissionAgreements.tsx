import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ListProductFormData } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface SubmissionAgreementsProps {
  form: UseFormReturn<ListProductFormData>;
}
export function SubmissionAgreements({
  form
}: SubmissionAgreementsProps) {
  return <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-700">Submission Agreements</h3>
      
      <FormField control={form.control} name="accuracyAgreement" render={({
      field
    }) => <FormItem className="space-y-2">
            <FormControl>
              <div className="flex items-start gap-2">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="accuracyAgreement" className="mt-1 bg-violet-400 hover:bg-violet-300" />
                <FormLabel htmlFor="accuracyAgreement" className="text-sm leading-relaxed text-gray-600 text-left">
                  I confirm that I will complete this form thoroughly and accurately to the best of my ability. I understand that comprehensive and precise information significantly enhances my listing's credibility and increases the likelihood of attracting serious buyers and investors.
                </FormLabel>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={form.control} name="termsAgreement" render={({
      field
    }) => <FormItem className="space-y-2">
            <FormControl>
              <div className="flex items-start gap-2">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="termsAgreement" className="mt-1 bg-violet-400 hover:bg-violet-300" />
                <FormLabel htmlFor="termsAgreement" className="text-sm leading-relaxed text-gray-600 text-left flex items-center gap-1">
                  I agree to the
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="h-auto p-0 text-[#8a5cf7] whitespace-nowrap">
                        Terms and Conditions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl mb-4">Terms and Conditions</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto pr-4">
                        <div className="prose prose-sm">
                          <p className="text-gray-500 mb-4">Last Updated: 10-1-2025</p>
                          
                          <p className="mb-4">Welcome to the AI Exchange Club ("Platform," "we," "us," or "our"). We provide Deal Flow as a Service (DFAAS) to connect investors with AI SaaS investment opportunities. By accessing or using our platform, you agree to comply with these Terms and Conditions ("Terms"). If you disagree, do not use the Platform.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
                          <p>By using the Platform, you agree to these Terms and our Privacy Policy. We may update these Terms at any time. Continued use after changes constitutes acceptance.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">2. Definitions</h2>
                          <p>Platform: Our Deal Flow as a Service (DFAAS) platform connecting investors with AI SaaS investment opportunities.</p>
                          <p>Investors: Venture capitalists and other qualified buyers seeking AI SaaS investment opportunities.</p>
                          <p>Entrepreneurs: AI SaaS founders and companies seeking investment or acquisition opportunities.</p>
                          <p>Deal Flow: Curated investment opportunities, market intelligence, and deal sourcing services.</p>
                          <p>Content: Listings, reviews, messages, deal information, or data uploaded to the Platform.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">3. Eligibility</h2>
                          <p>You must be 18+ or the age of majority in your jurisdiction.</p>
                          <p>Entrepreneurs must be authorized to represent their companies and provide accurate business information.</p>
                          <p>Prohibited for sanctioned individuals or entities.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">4. Account Registration</h2>
                          <p>Provide accurate, current information.</p>
                          <p>You are responsible for account security and activity.</p>
                          <p>Do not share accounts or use bots for registration.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">5. Investor and Entrepreneur Responsibilities</h2>
                          <p className="font-medium">Entrepreneurs:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Accurately represent your AI SaaS business, including financials, metrics, and business model.</li>
                            <li>Provide complete and truthful information about your company, technology, and market position.</li>
                            <li>Disclose all material information that could affect investment decisions.</li>
                            <li>Maintain confidentiality of sensitive business information as required.</li>
                          </ul>
                          <p className="font-medium">Investors:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Conduct your own due diligence before making investment decisions.</li>
                            <li>Comply with all applicable securities laws and regulations.</li>
                            <li>Maintain confidentiality of proprietary information shared during the investment process.</li>
                            <li>Use information obtained through the Platform solely for legitimate investment evaluation purposes.</li>
                          </ul>

                          <h2 className="text-lg font-semibold mt-6 mb-2">6. Intellectual Property (IP)</h2>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Entrepreneur IP: Entrepreneurs retain ownership of their AI SaaS technology and intellectual property.</li>
                            <li>Platform IP: We own all platform content, technology, and branding.</li>
                            <li>User Content: You grant us a license to host, display, and use your content for deal flow purposes.</li>
                            <li>Confidential Information: All parties must maintain confidentiality of proprietary information shared during the investment process.</li>
                          </ul>

                          <h2 className="text-lg font-semibold mt-6 mb-2">7. Marketing and Promotional Rights</h2>
                          <p>By listing your AI SaaS business on the Platform, you grant AI Exchange Club a non-exclusive, royalty-free license to:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Use your company name, description, logo, screenshots, and other listing content for deal flow marketing purposes.</li>
                            <li>Promote your investment opportunity across our marketing channels, including but not limited to email newsletters, social media accounts, blogs, and partner websites.</li>
                            <li>Feature your business in advertising materials both on and off our platform to attract qualified investors.</li>
                            <li>Create and distribute promotional content highlighting your business and its investment potential to our investor network.</li>
                          </ul>
                          <p>This promotional license remains in effect for the duration of your listing and for a reasonable period thereafter for ongoing marketing campaigns. You may request the removal of specific marketing materials after your listing ends by contacting us directly.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">8. AI SaaS Investment Disclosure Requirements</h2>
                          <p className="font-medium">Transparency: Entrepreneurs must disclose:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>AI technology stack, models used, and data sources.</li>
                            <li>Known risks, limitations, and potential biases in AI systems.</li>
                            <li>Regulatory compliance and data privacy measures.</li>
                            <li>Intellectual property ownership and third-party dependencies.</li>
                            <li>Technical due diligence results and security audits.</li>
                          </ul>

                          <h2 className="text-lg font-semibold mt-6 mb-2">9. Disclaimers and Liability</h2>
                          <p>No Investment Advice: The Platform is provided "as-is." We do not provide investment advice, guarantee returns, or warrant the success of any investment opportunity. All investment decisions are made at your own risk.</p>
                          <p>Due Diligence: Investors must conduct their own due diligence. We do not guarantee the accuracy of information provided by entrepreneurs or the success of any investment.</p>
                          
                          <h2 className="text-lg font-semibold mt-6 mb-2">10. Termination</h2>
                          <p>We may suspend/terminate accounts for violations. You may delete your account at any time.</p>


                          <h2 className="text-lg font-semibold mt-6 mb-2">11. Updates</h2>
                          <p>We will notify users of changes via email or in-platform alerts. Continued use = acceptance.</p>

                          <h2 className="text-lg font-semibold mt-6 mb-2">12. Contact Us</h2>
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
          </FormItem>} />
    </div>;
}