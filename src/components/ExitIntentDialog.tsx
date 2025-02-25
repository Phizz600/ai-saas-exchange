
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ExitIntentDialog() {
  const [isOpen, setIsOpen] = useState(false);
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
      if (
        e.clientY <= 0 && // User's mouse is at the top of the viewport
        shouldShow() &&
        window.innerWidth >= 1024 // Only show on desktop
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
      description: "We'll keep you updated with the latest AI marketplace news.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white font-exo text-center">
            Don't Miss Out on AI Opportunities!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4 p-4">
          <p className="text-white text-lg">
            Join thousands of AI entrepreneurs and investors getting exclusive deals and insights.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
            <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100">
              Get Exclusive Updates
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
