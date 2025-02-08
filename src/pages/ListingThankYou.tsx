
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ListingThankYou = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#0EA5E9]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8 bg-white/90 rounded-xl shadow-xl p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6">
            <img 
              src="/lovable-uploads/f74b20e6-6798-4aeb-badd-2da6c2dce40b.png"
              alt="AI Exchange Logo"
              className="w-24 h-24 object-contain animate-float"
            />
            <h1 className="text-4xl font-exo font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">
              Thank You for Your Submission!
            </h1>
            
            {/* Queue Position Card */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-[#8B5CF6]" />
                  <span className="text-lg font-semibold text-gray-700">Review Queue Status</span>
                </div>
                <span className="text-2xl font-bold text-[#D946EF]">#127</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Estimated review time: 24-48 hours</p>
            </div>

            <div className="space-y-4 text-center max-w-xl">
              <p className="text-lg text-gray-700">
                Your AI product has been successfully submitted and is now under review for approval.
              </p>
              <p className="text-lg text-gray-700">
                Our marketplace is launching soon, and we'll notify you as soon as we go live!
              </p>

              {/* Social Proof Section */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Users className="h-5 w-5 text-[#8B5CF6]" />
                  <span className="font-semibold text-gray-700">Join 1,000+ AI Founders</span>
                </div>
                <div className="space-y-2">
                  <Progress value={80} className="h-2 bg-purple-100" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-[#D946EF]">Only 200 spots left!</span> Be part of the first wave of AI innovators.
                  </p>
                </div>
              </div>

              <p className="text-gray-600 italic">
                Keep an eye on your email for updates about your listing and our launch.
              </p>
            </div>
            
            <Link to="/">
              <Button className="mt-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
