
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface NdaDialogProps {
  productId: string;
  productTitle: string;
  ndaContent: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function NdaDialog({
  productId,
  productTitle,
  ndaContent,
  onClose,
  onSuccess,
}: NdaDialogProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!isAgreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms of the NDA before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if the user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to sign the NDA",
          variant: "destructive",
        });
        return;
      }
      
      // Get the user's IP address (this is a placeholder, actual implementation may vary)
      // In a real app, you might want to use a server-side function to get the IP address
      const ipAddress = "User's browser";
      
      // Record the NDA signature
      const { error } = await supabase
        .from('product_ndas')
        .insert({
          user_id: user.id,
          product_id: productId,
          ip_address: ipAddress
        });
      
      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - user has already signed this NDA
          toast({
            title: "Already Signed",
            description: "You've already signed the NDA for this product",
          });
          onSuccess(); // Still consider this a success
        } else {
          throw error;
        }
      } else {
        toast({
          title: "NDA Signed",
          description: "You now have access to the full product details",
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error signing NDA:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign NDA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultNdaContent = `NON-DISCLOSURE AGREEMENT FOR AI PRODUCTS

This Non-Disclosure Agreement ("Agreement") is entered into between the seller of the AI product or service ("Seller", "Discloser") and you, the potential buyer or investor ("Recipient") viewing product details on AI Exchange Club.

1. DEFINITIONS

"AI Product" means the artificial intelligence product, service, model, algorithm, application, or technology being offered for sale or investment on AI Exchange Club.

"Confidential Information" means any proprietary or sensitive information related to the AI Product, including but not limited to:
- Technical specifications, algorithms, and model architecture
- Training methodologies and data sources
- Financial information and metrics
- User statistics and performance data
- Business strategies and monetization plans
- Intellectual property and trade secrets
- Source code and implementation details
- Customer and user information
- Any information marked as confidential or that should reasonably be understood as confidential

2. CONFIDENTIALITY OBLIGATIONS

2.1 The Recipient agrees to:
   (a) Maintain strict confidentiality of all Confidential Information
   (b) Not disclose Confidential Information to any third party
   (c) Use Confidential Information solely for evaluating a potential acquisition or investment
   (d) Take reasonable security measures to prevent unauthorized access
   (e) Not reverse engineer, decompile, or attempt to derive source code from the AI Product
   (f) Not use Confidential Information to develop competing products or services

2.2 Exclusions: This Agreement does not apply to information that:
   (a) Is or becomes publicly available through no fault of the Recipient
   (b) Was known to the Recipient prior to disclosure
   (c) Is independently developed by the Recipient without use of Confidential Information
   (d) Is disclosed pursuant to a valid court order or legal requirement

3. TERM AND TERMINATION

3.1 This Agreement shall remain in effect for three (3) years from the date of acceptance.
3.2 The confidentiality obligations shall survive termination of this Agreement.

4. REMEDIES

4.1 The Recipient acknowledges that monetary damages may not be sufficient remedy for unauthorized disclosure of Confidential Information.
4.2 The Discloser shall be entitled to seek injunctive relief to prevent breaches of this Agreement.

5. GOVERNING LAW

This Agreement shall be governed by the laws of Minnesota, USA, without regard to its conflict of law principles.

6. ACCEPTANCE

By clicking "Sign & View Details", you acknowledge that you have read, understand, and agree to be legally bound by the terms of this Agreement.

AI Exchange Club acts only as a facilitator and marketplace for this transaction and is not a party to this Agreement.`;

  return (
    <div className="max-w-2xl mx-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold exo-2-heading">
          Non-Disclosure Agreement
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Please review and agree to this NDA to view the full details of <span className="font-medium">{productTitle}</span>
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-64 overflow-y-auto text-sm">
          {ndaContent || defaultNdaContent}
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="nda-agree" 
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked === true)} 
          />
          <label htmlFor="nda-agree" className="text-sm cursor-pointer">
            I have read and agree to the terms of this Non-Disclosure Agreement
          </label>
        </div>
      </div>
      
      <DialogFooter className="mt-6 space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isAgreed || isLoading}
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing...
            </>
          ) : (
            'Sign & View Details'
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
