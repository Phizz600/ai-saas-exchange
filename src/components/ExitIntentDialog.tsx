import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, UserCog } from "lucide-react";
export function ExitIntentDialog() {
  // Force the dialog to be open
  const [isOpen, setIsOpen] = useState(true);
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState("");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Button type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-medium">Join the Club</Button>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <span>🔒</span>
              <p>Join 10,000+ AI professionals • No spam, ever</p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>;
}