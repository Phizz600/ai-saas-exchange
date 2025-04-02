
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

  const defaultNdaContent = `NON-DISCLOSURE AGREEMENT

Please read the following Non-Disclosure Agreement ("Agreement") carefully. By clicking on the "Sign & View Details" button you are indicating your acceptance of this Non-Disclosure Agreement and agree to be legally bound by it.

For the purposes of this Agreement, "AI Product" means the AI product or service currently advertised and offered for sale on AI Exchange Club which you are viewing.

"Seller" means the owner of the AI Product.

"You" or "Your" or "Buyer" means the person or company who is interested in acquiring the AI Product.

For the purpose of this Agreement, You and the Seller are each a "Party" and collectively "The Parties."

This Agreement is effective as of the date of Your acceptance of this Agreement.
You wish to evaluate the AI Product and engage in discussions with the Seller in connection with Your possible acquisition of the AI Product ("Purpose").
The Seller wishes to disclose certain Confidential Information to You relating to the Purpose. You enter into this Agreement to protect the confidentiality of the Confidential Information, on the terms set out below.
You acknowledge and agree that terms of this Agreement are binding upon You and enforceable by the Seller.

"Confidential Information" means any information provided by the Seller or any of its Personnel to You or any of your Personnel for or in connection with the Purpose, including: (a) information designated as confidential by the Seller; (b) information imparted in circumstances of confidence; (c) any AI models, algorithms, training data, or technical implementations; (d) business processes, revenue figures, customer information, or operational details; or (e) information that You know, or ought to know, is confidential, but excluding information which is already known by You at the time it is disclosed, or which is or becomes public knowledge other than by a breach of this Agreement.

"Personnel" means any employee, officer, agent, contractor, subcontractor, student or volunteer of a Party, and any employee, officer, agent, contractor, subcontractor, student or volunteer of a contractor or subcontractor, but excludes the other Party and its Personnel.

You acknowledge and agree that the Confidential Information is valuable.
In consideration for the Seller providing the Confidential Information to You, You accept and agree to keep the Confidential Information confidential in accordance terms of this Agreement.
Subject to clause 10, You must (a) keep the Confidential Information confidential and preserve its confidential nature; and (b) not use or disclose or permit the use or disclosure of Confidential Information for any purpose other than the Purpose.
This Agreement does not prohibit the use or disclosure of Confidential Information (a) required to be disclosed by You by law or pursuant to the rules of any securities exchange; (b) by You to your legal or other advisers, subject to the relevant adviser being subject to confidentiality obligations or a confidentiality undertaking in a form reasonably satisfactory to the Seller; (c) which is necessary for the Purpose, but only to the extent necessary for the Purpose; (d) to an auditor solely for the purposes of an audit; or (e) which the Seller has agreed in writing may be used or disclosed by You, provided such use or disclosure is in accordance with the terms of that agreement.

You must ensure (a) your Personnel are made aware of the confidential nature of the Confidential Information and the terms of this Agreement before being provided with or having access to Confidential Information; and (b) your Personnel do not do or fail to do anything that, if done or not done, would amount to a breach of your obligations under this Agreement.
If You become aware that You have or may breach this Agreement, You must immediately notify the Seller and take all reasonable steps required to stop the breach.
Unless agreed otherwise in writing, this Agreement and the obligations under this Agreement continue in full force and effect for three (3) years from the Commencement Date.

You acknowledge that the Confidential Information remains the property of the Seller at all times and that this Agreement does not convey to You or any of your Personnel any proprietary or other interest in the Confidential Information.
You must, promptly upon request by the Seller, return or destroy all material containing Confidential Information in your possession, power or control, which was either received from the Seller or which You have generated.
You acknowledge that disclosure of any Confidential Information in breach of this Agreement would cause irreparable harm to the Seller for which damages may not be an adequate remedy.
You consent to the grant of injunctive relief to restrain any breach of this Agreement, or specific performance to compel You to perform your obligations under this Agreement, as a remedy for any breach or threatened breach of this Agreement and in addition to any other remedies available to the Seller.

You indemnify the Seller against any claims, loss, damages, costs and expenses (including legal costs on a solicitor and own client basis) that the Seller incurs or suffers directly or indirectly as a result of a breach of this Agreement by You, or any unauthorised use or disclosure of the Confidential Information by You or your Personnel or a person who received Confidential Information from any of them.

This Agreement is governed by the laws of Minnesota and You agree to submit to the non-exclusive jurisdiction of its courts.
This Agreement shall be binding upon and for the benefit of the Parties, their successors and assigns.
This Agreement constitutes Your entire understanding in relation to its subject matter and supersedes all prior written or oral agreements or undertakings regarding that subject matter.
You may not assign this Agreement (or any right under it) to another person without the prior, written consent of the Seller.
The termination or expiry of this Agreement for any reason will not extinguish Your obligations, which, either expressly or by their nature, are intended to survive termination or expiry, including clause 9.`;

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
