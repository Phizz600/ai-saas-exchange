
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

  // Function to get detailed user device information
  const getUserDeviceInfo = () => {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(deviceInfo);
  };

  // Function to get IP address via a public API
  const getIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unable to determine IP';
    }
  };

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
      
      // Get the user's actual IP address
      const ipAddress = await getIpAddress();
      
      // Get detailed device information
      const deviceInfo = getUserDeviceInfo();
      
      // Record the NDA signature with enhanced information
      const { error } = await supabase
        .from('product_ndas')
        .insert({
          user_id: user.id,
          product_id: productId,
          ip_address: ipAddress,
          device_info: deviceInfo
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

  // Flippa-style NDA content tailored for AI Exchange Club
  const flippaStyleNdaContent = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on the date of electronic acceptance between:

You ("Recipient") and AI Exchange Club LLC ("AI Exchange"), a platform facilitating the buying and selling of AI-powered businesses and products.

1. PURPOSE
   The Recipient wishes to evaluate certain confidential and proprietary information relating to the AI business or product listed on the AI Exchange Club platform for the sole purpose of evaluating a potential acquisition.

2. CONFIDENTIAL INFORMATION
   "Confidential Information" means all information disclosed by a seller ("Disclosing Party") through AI Exchange Club, whether oral, written, electronic, or otherwise, including but not limited to:
   
   a) Business information: Financial data, revenue metrics, profit margins, customer acquisition costs, pricing strategies, and business operations
   b) Technical information: Software code, algorithms, AI models, system architecture, technical specifications, and implementation methods
   c) Customer information: Customer lists, user data, engagement metrics, and user behavior analytics
   d) Intellectual property: Trade secrets, know-how, inventions, techniques, processes, research, and development
   e) Marketing information: Marketing strategies, market research, competition analysis, and promotional plans
   f) Any information that would reasonably be understood to be confidential or proprietary

3. RECIPIENT OBLIGATIONS
   The Recipient agrees to:
   
   a) Maintain all Confidential Information in strict confidence
   b) Use Confidential Information solely for evaluating the potential acquisition
   c) Not disclose Confidential Information to any third party without prior written consent
   d) Take reasonable security measures to protect Confidential Information
   e) Not reverse-engineer, decompile, or disassemble any software or AI models
   f) Not use the information to create a competing product or service
   g) Promptly notify AI Exchange Club of any unauthorized disclosure or use

4. EXCLUSIONS
   This Agreement does not impose obligations with respect to information that:
   
   a) Was lawfully in Recipient's possession before receiving it from the Disclosing Party
   b) Is or becomes publicly available through no act or fault of the Recipient
   c) Is received by Recipient from a third party without a duty of confidentiality
   d) Is independently developed by Recipient without use of Confidential Information
   e) Is disclosed pursuant to a court order, provided Recipient gives advance notice to the Disclosing Party

5. TERM AND TERMINATION
   This Agreement shall remain in effect for three (3) years from the date of acceptance. The Recipient's obligation to maintain confidentiality survives termination of this Agreement.

6. RETURN OF MATERIALS
   Upon request of the Disclosing Party or AI Exchange Club, or when Confidential Information is no longer needed, the Recipient shall promptly return or destroy all materials containing Confidential Information.

7. NO LICENSE GRANTED
   Nothing in this Agreement grants the Recipient any rights to patents, copyrights, trademarks, or other intellectual property rights. No license is granted or implied by this Agreement.

8. REMEDIES
   The Recipient acknowledges that monetary damages may be inadequate for a breach of this Agreement and that the Disclosing Party shall be entitled to seek injunctive relief in addition to any other available remedies.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of the State of Minnesota without regard to its conflict of law provisions. Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of Minnesota.

10. DIGITAL SIGNATURE AND RECORDKEEPING
    The Recipient acknowledges that clicking "Sign & View Details" constitutes a legally binding electronic signature. AI Exchange Club will maintain a record of this agreement, including:
    
    a) Date and time of acceptance
    b) IP address of the Recipient
    c) Browser and device information
    d) Any other information required to establish the validity of this Agreement

11. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding between the parties regarding Confidential Information and supersedes all prior agreements between them.

By clicking "Sign & View Details," the Recipient acknowledges reading, understanding, and agreeing to all the terms of this Agreement.`;

  // Confidentiality notice to display at the top of the dialog
  const confidentialityNotice = (
    <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm border border-red-200 flex items-center">
      <div className="mr-2 flex-shrink-0">⚠️</div>
      <div>
        <strong>Confidentiality Notice:</strong> The information you are about to access is confidential. 
        Your IP address and device information will be recorded for security purposes.
      </div>
    </div>
  );

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
        {/* Add confidentiality notice */}
        {confidentialityNotice}
        
        {/* NDA content with watermark */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-64 overflow-y-auto text-sm whitespace-pre-wrap relative">
          {/* Add a diagonal watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
            <div className="transform rotate-45 text-gray-500 text-4xl font-bold flex whitespace-nowrap">
              <span className="mx-4">CONFIDENTIAL</span>
              <span className="mx-4">CONFIDENTIAL</span>
              <span className="mx-4">CONFIDENTIAL</span>
            </div>
          </div>
          {ndaContent || flippaStyleNdaContent}
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
