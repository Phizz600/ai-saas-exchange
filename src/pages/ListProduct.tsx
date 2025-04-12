
import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ListProduct = () => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        if (!user) {
          console.log("User not authenticated, showing warning");
          toast.warning("Please sign in", {
            description: "You need to be signed in to list a product",
            duration: 10000,
            action: {
              label: "Sign In",
              onClick: () => window.location.href = "/auth?redirect=/list-product"
            }
          });
        } else {
          console.log("User authenticated:", user.email);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  console.log('ListProduct page rendered');
  return <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      {/* Promotional Banner */}
      <div className="w-full bg-black text-white py-3 text-center text-sm sm:text-base font-medium px-4">
        🚀 Early Bird Special: $10 Listing Fee (90% Off)! Lock in $10 for Life - Fee Jumps to $100 After Launch
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6 bg-white/90 rounded-xl shadow-xl p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Link to="/">
              <img src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png" alt="AI Exchange Logo" className="w-20 h-20 object-contain animate-float" />
            </Link>
            <h1 className="exo-2-heading font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-stone-950 text-2xl">
              List Your AI Product
            </h1>
            <p className="text-gray-600 text-center max-w-xl">
              Complete this form with detailed and accurate information to showcase your product's value and increase buyer interest.
            </p>
            
            {isAuthenticated === false && (
              <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <p className="font-medium">You need to be signed in to list a product</p>
                <Button 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => window.location.href = "/auth?redirect=/list-product"}
                >
                  Sign In / Register
                </Button>
              </div>
            )}
          </div>
          <ListProductForm />
        </div>
      </div>

      {/* Help Button */}
      <button 
        className="fixed bottom-6 right-6 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
        onClick={() => setHelpDialogOpen(true)}
      >
        <HelpCircle className="h-6 w-6 text-[#8B5CF6]" />
      </button>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>
            Need help listing? Book a free call and we'll walk you through the entire process.
          </DialogDescription>
          <DialogFooter>
            <Button asChild>
              <a 
                href="https://calendly.com/aiexchangeclub/listing-walkthrough" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Free Call
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
