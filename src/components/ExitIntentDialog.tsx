
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, UserCog, Sparkles, BrainCircuit } from "lucide-react";

export function ExitIntentDialog() {
  // Set isOpen to true to display the dialog immediately
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const shouldShow = () => {
      const lastShown = localStorage.getItem("exitIntentShown");
      if (lastShown) {
        const timeSinceLastShow = Date.now() - parseInt(lastShown);
        // Don't show if it was shown in the last 7 days
        if (timeSinceLastShow < 7 * 24 * 60 * 60 * 1000) {
          return false;
        }
      }
      return true;
    };
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 &&
      // User's mouse is at the top of the viewport
      shouldShow() && window.innerWidth >= 1024 // Only show on desktop
      ) {
        setIsOpen(true);
        localStorage.setItem("exitIntentShown", Date.now().toString());
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the email subscription
    console.log("Email submitted:", email);
    toast({
      title: "Thank you for subscribing!",
      description: "We'll keep you updated with the latest AI marketplace news."
    });
    setIsOpen(false);
  };

  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9] relative overflow-hidden">
        {/* AI-related decorative elements */}
        <div className="absolute -top-8 -right-8 text-white/20 rotate-12">
          <BrainCircuit size={80} />
        </div>
        <div className="absolute -bottom-8 -left-8 text-white/20 -rotate-12">
          <BrainCircuit size={80} />
        </div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-white exo-2-heading text-center text-xl flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            Unlock Exclusive AI Deals &amp; Insights
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-6 p-4 relative z-10">
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-medium relative group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Join the Club
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="absolute inset-0 rounded-md bg-orange-500 opacity-0 group-hover:opacity-100 group-hover:animate-pulse blur-md transition-all duration-500 ease-in-out"></span>
            </Button>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <span>🔒</span>
              <p>Join 10,000+ AI professionals • No spam, ever</p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>;
}
