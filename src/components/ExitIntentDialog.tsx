import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, UserCog } from "lucide-react";
export function ExitIntentDialog() {
  // Set isOpen to true by default to display the dialog immediately
  const [isOpen, setIsOpen] = useState(true);
  const {
    toast
  } = useToast();
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
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
        <DialogHeader>
          <DialogTitle className="text-white exo-2-heading text-center text-xl">Unlock Exclusive AI Deals &amp; Insights</DialogTitle>
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
            Join thousands of AI entrepreneurs and investors getting exclusive deals and insights.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="w-full" required />
            <Button type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-medium">
              Get Exclusive Updates
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