import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quizQuestions = [
  {
    id: 1,
    question: "What AI category does your SaaS business primarily operate in?",
    options: [
      { value: "nlp", label: "Natural Language Processing / Generative AI", icon: "💬" },
      { value: "cv", label: "Computer Vision / Image Recognition", icon: "👁️" },
      { value: "ml", label: "Predictive Analytics / Machine Learning", icon: "📊" },
      { value: "automation", label: "AI Automation / Workflow Tools", icon: "🤖" },
      { value: "other", label: "Other AI Specialization", icon: "🔍" },
    ],
  },
  {
    id: 2,
    question: "What is your average monthly recurring revenue (MRR)?",
    options: [
      { value: "5000", label: "$0 - $10,000" },
      { value: "30000", label: "$10,000 - $50,000" },
      { value: "75000", label: "$50,000 - $100,000" },
      { value: "300000", label: "$100,000 - $500,000" },
      { value: "750000", label: "$500,000+" },
    ],
  },
  {
    id: 3,
    question: "How many active users does your platform have monthly?",
    options: [
      { value: "50", label: "Under 100" },
      { value: "500", label: "100 - 1,000" },
      { value: "5000", label: "1,000 - 10,000" },
      { value: "50000", label: "10,000 - 100,000" },
      { value: "500000", label: "100,000+" },
    ],
  },
  {
    id: 4,
    question: "What is your year-over-year revenue growth rate?",
    options: [
      { value: "10", label: "0% - 20%" },
      { value: "35", label: "20% - 50%" },
      { value: "75", label: "50% - 100%" },
      { value: "150", label: "100%+" },
    ],
  },
  {
    id: 5,
    question: "How would you describe the market trend for your AI solution?",
    options: [
      { value: "emerging", label: "Emerging / High Growth Market" },
      { value: "growing", label: "Growing / Positive Trend" },
      { value: "stable", label: "Established / Stable Market" },
      { value: "declining", label: "Declining / Challenged Market" },
    ],
  },
];

export const QuizDialog = ({ open, onOpenChange }: QuizDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    sellingInterest: true,
  });

  const { toast } = useToast();

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast({
        title: "Please select an option",
        description: "Choose an option to continue to the next question",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion === quizQuestions.length) {
      setShowResults(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email to receive your valuation.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would typically send the data to your backend
      console.log("Form submitted with data:", {
        ...formData,
        answers,
      });

      setShowConfirmation(true);
      toast({
        title: "Success!",
        description: "Your valuation has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your valuation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const progress = (currentQuestion / quizQuestions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-6 -m-6 mb-6 rounded-t-lg">
          <h2 className="text-white text-xl font-bold text-center">What's your AI SaaS Businesses' Really Worth?</h2>
          <p className="text-white/90 text-sm text-center mt-2">
            Get a free estimate of your AI SaaS company's worth in just 60 seconds
          </p>
        </div>

        <div className="h-2 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full bg-[#6366f1] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!showResults && !showConfirmation && (
          <div className="space-y-6">
            <div className="font-semibold text-lg">
              {quizQuestions[currentQuestion - 1].question}
            </div>
            <div className="space-y-3">
              {quizQuestions[currentQuestion - 1].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(currentQuestion, option.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[currentQuestion] === option.value
                      ? "border-[#6366f1] bg-[#f0f4ff]"
                      : "border-gray-200 hover:border-[#6366f1] hover:bg-[#f5f7ff]"
                  }`}
                >
                  {option.icon && <span className="mr-3">{option.icon}</span>}
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext}>
                {currentQuestion === quizQuestions.length ? (
                  <>Calculate My Valuation</>
                ) : (
                  <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        )}

        {showResults && !showConfirmation && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Your Valuation is Ready!</h3>
              <p className="text-lg font-semibold text-[#6366f1] mb-4">
                Where should we send your personalized AI SaaS valuation?
              </p>
              <p className="text-gray-600">
                We'll email you a detailed valuation range based on current market conditions and your inputs,
                along with next steps to list your business on AI Exchange.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <Input
                  type="text"
                  placeholder="Your AI SaaS Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sellingInterest}
                  onChange={(e) => setFormData({ ...formData, sellingInterest: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  I'm interested in exploring options to sell my AI SaaS business in the next 12 months
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full bg-[#8b5cf6] hover:bg-[#7c4def]">
              <Send className="mr-2 h-4 w-4" /> Send My Valuation
            </Button>
          </form>
        )}

        {showConfirmation && (
          <div className="text-center space-y-4 py-4">
            <div className="text-[#6366f1] text-4xl mb-6">✉️</div>
            <h3 className="text-xl font-bold text-[#10b981] mb-4">
              Your Valuation is on the Way!
            </h3>
            <p>
              We've sent your personalized AI SaaS valuation to{" "}
              <span className="font-semibold">{formData.email}</span>
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Check your inbox in the next 5 minutes. The email will include your valuation range
                and instructions on how to list your business on AI Exchange.
              </p>
            </div>
            <p className="flex items-center justify-center text-sm text-gray-600 mt-6">
              <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
              Similar AI SaaS businesses receive their first qualified offer within 14 days of listing
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
