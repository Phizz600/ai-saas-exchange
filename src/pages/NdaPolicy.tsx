
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileCheck, Eye, UserCheck, AlertTriangle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ConfidentialWatermark } from "@/components/marketplace/product-card/ConfidentialWatermark";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const NdaPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-white to-accent2/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <h1 className="exo-2-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">Enhanced NDA Policy</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6]"></div>
          </div>
          
          <p className="text-gray-600 mt-8 text-lg">
            At AI Exchange Club, we understand that confidentiality is paramount when selling your AI business or product. 
            Our enhanced Non-Disclosure Agreement (NDA) system provides multiple layers of protection to ensure your 
            sensitive business information remains secure throughout the entire selling process.
          </p>

          {/* Hero section with image */}
          <div className="mt-12 relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200&h=600" 
              alt="Secure digital technology" 
              className="w-full h-64 object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/80 to-transparent flex items-center">
              <div className="p-8 md:p-16 max-w-lg">
                <h2 className="text-white text-3xl font-bold mb-4 exo-2-heading">Trusted by Industry Leaders</h2>
                <p className="text-white/90">
                  Our NDA system is designed to meet industry standards and has been vetted by legal professionals 
                  specializing in technology transactions.
                </p>
              </div>
            </div>
            {/* Subtle watermark for visual effect */}
            <ConfidentialWatermark text="SECURE" opacity={0.05} rotation={-45} />
          </div>

          {/* Key features section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 exo-2-heading">Key Features of Our NDA System</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 border-t-4 border-t-[#D946EE] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#D946EE]/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-[#D946EE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">IP Address Tracking</h3>
                    <p className="text-gray-600">
                      Every NDA signature is recorded with the signer's IP address, providing an additional layer 
                      of accountability and traceability.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-t-4 border-t-[#8B5CF6] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#8B5CF6]/10 p-3 rounded-full">
                    <Lock className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Digital Signatures</h3>
                    <p className="text-gray-600">
                      Our system uses secure digital signatures that are timestamped and legally binding in most jurisdictions.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-t-4 border-t-[#0EA4E9] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0EA4E9]/10 p-3 rounded-full">
                    <FileCheck className="h-6 w-6 text-[#0EA4E9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Legal Enforceability</h3>
                    <p className="text-gray-600">
                      Our NDAs are drafted by technology law specialists to ensure they are legally enforceable 
                      and provide meaningful protection.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-t-4 border-t-[#D946EE] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#D946EE]/10 p-3 rounded-full">
                    <Eye className="h-6 w-6 text-[#D946EE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Access Controls</h3>
                    <p className="text-gray-600">
                      Confidential information is only revealed after an NDA is signed, with clear visual indicators 
                      showing protected content.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-t-4 border-t-[#8B5CF6] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#8B5CF6]/10 p-3 rounded-full">
                    <UserCheck className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Device Fingerprinting</h3>
                    <p className="text-gray-600">
                      We capture device information at the time of signature for additional verification and security measures.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-t-4 border-t-[#0EA4E9] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0EA4E9]/10 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-[#0EA4E9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Copy Protection</h3>
                    <p className="text-gray-600">
                      Our platform includes technical measures to prevent unauthorized copying, printing, and sharing of confidential content.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-16 bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] p-8 md:p-12 rounded-xl shadow-lg text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 exo-2-heading">Ready to List Your AI Product?</h2>
                <p className="text-white/90 max-w-xl">
                  List your AI business with confidence, knowing that your confidential information is protected by our 
                  comprehensive NDA system.
                </p>
              </div>
              <Link to="/list-product">
                <Button className="bg-white text-[#8B5CF6] hover:bg-gray-100 px-8 py-6 text-lg shadow-md">
                  List Your Product
                </Button>
              </Link>
            </div>
          </div>
          
          {/* FAQ Section with Accordion */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 exo-2-heading">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-xl font-medium">
                  Are the NDAs legally binding?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, our NDAs are crafted by legal experts specializing in technology law and are designed to be legally 
                  binding in most jurisdictions.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-xl font-medium">
                  What happens if someone breaches the NDA?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Our platform captures comprehensive evidence of agreement to terms, which can be used in legal proceedings 
                  if a breach occurs. Additionally, our team can assist with the initial steps of addressing an NDA violation.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-xl font-medium">
                  Can I customize the NDA for my specific product?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Premium sellers can work with our legal team to customize certain aspects of the NDA to address specific 
                  concerns or unique aspects of their business.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-xl font-medium">
                  How do you verify the identity of NDA signers?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  We employ a multi-factor verification process that includes email confirmation, device fingerprinting, 
                  and IP address logging to ensure the signer's identity can be traced and verified.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border rounded-lg overflow-hidden shadow-sm bg-white">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-xl font-medium">
                  How long does the NDA protection last?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Our standard NDAs provide protection for two years from the date of signing, but premium sellers can 
                  customize the duration to meet their specific requirements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NdaPolicy;
