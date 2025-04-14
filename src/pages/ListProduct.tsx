
import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AnimatedGradientBackground from "@/components/ui/AnimatedGradientBackground";
import { motion } from "framer-motion";

export const ListProduct = () => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Authentication error:", error.message);
          toast.error("Authentication Error", {
            description: "There was a problem verifying your account. Please try signing in again.",
          });
          setIsAuthenticated(false);
          return;
        }
        
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
        toast.error("Connection Error", {
          description: "Unable to verify your account. Please check your internet connection and try again."
        });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  console.log('ListProduct page rendered');
  
  return (
    <AnimatedGradientBackground>
      {/* Promotional Banner */}
      <div className="w-full bg-black text-white py-3 text-center text-sm sm:text-base font-medium px-4">
        🚀 Early Bird Special: $10 Listing Fee (90% Off)! Lock in $10 for Life - Fee Jumps to $100 After Launch
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6 glass rounded-xl shadow-xl p-8 backdrop-blur-lg bg-white/10 border border-white/20"
        >
          <div className="flex flex-col items-center space-y-4">
            <Link to="/">
              <motion.img 
                src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png" 
                alt="AI Exchange Logo" 
                className="w-20 h-20 object-contain" 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </Link>
            <h1 className="exo-2-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 text-2xl">
              List Your AI Product
            </h1>
            <p className="text-white/80 text-center max-w-xl">
              Complete this form with detailed and accurate information to showcase your product's value and increase buyer interest.
            </p>
            
            {isLoading ? (
              <div className="w-full p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white/80">Checking authentication status...</p>
                </div>
              </div>
            ) : isAuthenticated === false ? (
              <div className="w-full p-4 bg-amber-900/20 backdrop-blur-md border border-amber-500/20 rounded-md text-amber-200">
                <p className="font-medium">You need to be signed in to list a product</p>
                <Button 
                  variant="outline" 
                  className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors" 
                  onClick={() => window.location.href = "/auth?redirect=/list-product"}
                >
                  Sign In / Register
                </Button>
              </div>
            ) : null}
          </div>
          <ListProductForm />
        </motion.div>
      </div>

      {/* Help Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/30 transition-colors border border-white/20 z-20"
        onClick={() => setHelpDialogOpen(true)}
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </motion.button>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md glass backdrop-blur-lg bg-white/10 border border-white/20 text-white">
          <DialogTitle className="exo-2-heading text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Need Help?</DialogTitle>
          <DialogDescription className="text-white/80">
            <p className="mb-2">Having trouble with your listing? Here are some quick tips:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Make sure your product image is under 5MB and in JPG, PNG, or WebP format</li>
              <li>Provide a unique product title that hasn't been used before</li>
              <li>Fill out all required fields in each section</li>
              <li>Check your internet connection if you're having trouble submitting</li>
            </ul>
            <p>Still need help? Book a free call and we'll walk you through the entire process.</p>
          </DialogDescription>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setHelpDialogOpen(false)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              Close
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 text-white"
              asChild
            >
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
    </AnimatedGradientBackground>
  );
};
