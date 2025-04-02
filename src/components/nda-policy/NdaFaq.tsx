
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const NdaFaq = () => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 exo-2-heading text-white">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1" className="border rounded-lg overflow-hidden shadow-sm bg-white/10 backdrop-blur-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-xl font-medium text-white">
            Are the NDAs legally binding?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-white/80">
            Yes, our NDAs are crafted by legal experts specializing in technology law and are designed to be legally 
            binding in most jurisdictions.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border rounded-lg overflow-hidden shadow-sm bg-white/10 backdrop-blur-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-xl font-medium text-white">
            What happens if someone breaches the NDA?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-white/80">
            Our platform captures comprehensive evidence of agreement to terms, which can be used in legal proceedings 
            if a breach occurs. Additionally, our team can assist with the initial steps of addressing an NDA violation.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border rounded-lg overflow-hidden shadow-sm bg-white/10 backdrop-blur-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-xl font-medium text-white">
            Can I customize the NDA for my specific product?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-white/80">
            Premium sellers can work with our legal team to customize certain aspects of the NDA to address specific 
            concerns or unique aspects of their business.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="border rounded-lg overflow-hidden shadow-sm bg-white/10 backdrop-blur-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-xl font-medium text-white">
            How do you verify the identity of NDA signers?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-white/80">
            We employ a multi-factor verification process that includes email confirmation, device fingerprinting, 
            and IP address logging to ensure the signer's identity can be traced and verified.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5" className="border rounded-lg overflow-hidden shadow-sm bg-white/10 backdrop-blur-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-xl font-medium text-white">
            How long does the NDA protection last?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-white/80">
            Our standard NDAs provide protection for two years from the date of signing, but premium sellers can 
            customize the duration to meet their specific requirements.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
