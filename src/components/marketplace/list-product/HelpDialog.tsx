import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass backdrop-blur-lg bg-white/10 border border-white/20 text-white">
        <DialogTitle className="exo-2-heading text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
          Need Help?
        </DialogTitle>
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
            onClick={() => onOpenChange(false)} 
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
  );
};
 