
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, UserCog } from "lucide-react";

export function ExitIntentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we should show the dialog (once per day)
    const shouldShowDialog = () => {
      const lastShown = localStorage.getItem('exitIntentLastShown');
      
      if (!lastShown) return true;
      
      const lastShownDate = new Date(lastShown);
      const currentDate = new Date();
      
      // Check if it's been more than 24 hours since last shown
      return currentDate.getTime() - lastShownDate.getTime() > 24 * 60 * 60 * 1000;
    };

    // Only show if we should based on last shown time
    if (shouldShowDialog()) {
      // Show dialog after 30 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Update the last shown time in localStorage
        localStorage.setItem('exitIntentLastShown', new Date().toISOString());
      }, 30000); // 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Function to redirect to beehiiv subscription page
  const handleRedirect = () => {
    window.open("https://aiexchangeclub.beehiiv.com/subscribe", "_blank");
  };

  // Allow closing the dialog
  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
        <DialogHeader>
          <DialogTitle className="text-white exo-2-heading text-center text-xl">
            Unlock Exclusive AI Deals &amp; Insights
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-6 p-4">
          <div className="flex justify-center gap-12 items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <span className="text-white text-sm">For Investors</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <UserCog className="h-8 w-8 text-white" />
              </div>
              <span className="text-white text-sm">For Builders</span>
            </div>
          </div>
          <p className="text-white text-lg">
            Get early access to premium AI tools, off-market deals, and actionable insights—before anyone else.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={handleRedirect} 
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium"
            >
              Join the Club
            </Button>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <span>🔒</span>
              <p>Join 10,000+ AI professionals • No spam, ever</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
