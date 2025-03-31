
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
          {ndaContent || 
            `By accessing the confidential information about this product, you agree to:
            
            1. Keep all information confidential and not disclose it to any third party.
            2. Use the information solely for the purpose of evaluating the product for potential purchase.
            3. Not use the information to create a competing product.
            4. Return or destroy all confidential information upon request.
            
            This NDA is legally binding and enforceable.`
          }
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
