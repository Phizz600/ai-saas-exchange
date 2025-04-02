
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

  // Use the provided NDA content or fall back to the default
  const defaultNdaContent = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between you ("Recipient" or "You") and the seller of the AI product or service ("Seller") listed on AI Exchange Club.

PLEASE READ THIS AGREEMENT CAREFULLY BEFORE ACCESSING CONFIDENTIAL INFORMATION. BY CLICKING "SIGN & VIEW DETAILS," YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND, AND AGREE TO BE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT.

1. PURPOSE
   You wish to evaluate the AI product or service ("Product") for potential acquisition. The Seller will disclose certain confidential and proprietary information to enable your evaluation.

2. CONFIDENTIAL INFORMATION
   "Confidential Information" includes, but is not limited to:
   • Financial data (revenue, profit margins, customer acquisition costs)
   • Technical specifications and source code
   • Customer and user data
   • Proprietary algorithms and AI models
   • Business strategies and operational methods
   • Any information reasonably understood to be confidential

3. RECIPIENT OBLIGATIONS
   You agree to:
   a) Keep all Confidential Information strictly confidential
   b) Use Confidential Information solely for evaluating the potential acquisition
   c) Not reverse-engineer, decompile, or disassemble any software or AI models
   d) Not use the information to create a competing product or service
   e) Not disclose Confidential Information to any third party without prior written consent
   f) Take reasonable security measures to protect the Confidential Information

4. EXCLUSIONS
   This Agreement does not apply to information that:
   a) Was already known to You prior to disclosure
   b) Is or becomes publicly available through no fault of Your own
   c) Is independently developed by You without use of Confidential Information
   d) Is rightfully obtained from a third party without restriction

5. TERM AND TERMINATION
   This Agreement shall remain in effect for three (3) years from the date of acceptance. Your obligations regarding the protection of Confidential Information shall survive the termination of this Agreement.

6. RETURN OF MATERIALS
   Upon Seller's request or termination of discussions, You shall promptly return or destroy all materials containing Confidential Information.

7. NO RIGHTS GRANTED
   Nothing in this Agreement grants You any rights to intellectual property, licenses, or ownership of the Product or Confidential Information.

8. REMEDIES
   You acknowledge that monetary damages may be inadequate for a breach of this Agreement and that the Seller shall be entitled to seek injunctive relief in addition to any other available remedies.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of the State of Minnesota, without regard to its conflict of law principles.

10. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding between You and the Seller regarding the Confidential Information and supersedes all prior discussions.

By signing this Agreement, You certify that You are authorized to receive the Confidential Information and agree to be bound by the terms herein.`;

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
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-64 overflow-y-auto text-sm whitespace-pre-wrap">
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
