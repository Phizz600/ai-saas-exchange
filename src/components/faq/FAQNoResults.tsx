
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface FAQNoResultsProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export const FAQNoResults = ({ searchQuery, onClearSearch }: FAQNoResultsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Question submitted",
        description: "We've received your question and will get back to you soon.",
      });
      
      // Reset form
      setEmail("");
      setQuestion("");
      setReceiveUpdates(false);
      setShowForm(false);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center max-w-2xl mx-auto mt-8">
      <div className="p-3 rounded-full bg-[#D946EE]/20 inline-flex items-center justify-center mb-4">
        <MessageSquare className="h-6 w-6 text-[#D946EE]" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        No results found for "{searchQuery}"
      </h3>
      
      <p className="text-white/80 mb-6">
        We couldn't find any FAQ items matching your search. Try using different keywords or ask us directly.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Button 
          variant="outline" 
          onClick={onClearSearch}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Clear Search
        </Button>
        
        <Button
          className="bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white hover:opacity-90"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Ask a Question"}
        </Button>
      </div>
      
      {showForm && (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mt-4 text-left">
          <h4 className="text-lg font-medium text-white mb-4">Submit Your Question</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white mb-1 block">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div>
              <Label htmlFor="question" className="text-white mb-1 block">Your Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                placeholder="What would you like to know?"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="updates" 
                checked={receiveUpdates} 
                onCheckedChange={(checked) => 
                  setReceiveUpdates(checked === true)
                } 
              />
              <Label htmlFor="updates" className="text-white/80 text-sm">
                Receive updates when your question is answered
              </Label>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-white/10 text-white/80">
        <p>You can also reach us directly:</p>
        <div className="flex justify-center gap-6 mt-3">
          <a href="mailto:support@aiexchangeclub.com" className="text-white hover:text-[#D946EE] transition-colors">
            support@aiexchangeclub.com
          </a>
          <a href="/contact" className="text-white hover:text-[#D946EE] transition-colors">
            Contact Page
          </a>
        </div>
      </div>
    </div>
  );
};
