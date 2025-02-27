import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Timer, Youtube, Twitter, Instagram, Rss, MousePointerClick } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ListingThankYou = () => {
  const [queueNumber, setQueueNumber] = useState(0);

  useEffect(() => {
    // Generate a random number between 1 and 207
    const randomNumber = Math.floor(Math.random() * 207) + 1;
    setQueueNumber(randomNumber);
  }, []); // Empty dependency array means this runs once when component mounts

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

            <div className="space-y-4 text-center max-w-xl">
              <p className="text-lg text-gray-700">
                Your AI product has been successfully submitted and is now under review for approval. Our marketplace is launching soon, and we'll notify you as soon as we go live!
              </p>
            </div>
            
            <div className="space-y-4 text-center max-w-xl">
              <p className="text-gray-600 italic">
                Keep an eye on your email for updates about your listing and our launch.
              </p>
            </div>

            {/* Queue Position Card */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-[#8B5CF6]" />
                  <span className="text-lg font-semibold text-gray-700">Review Queue Status</span>
                </div>
                <span className="text-2xl font-bold text-[#D946EF]">#{queueNumber}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Estimated review time: 24-48 hours</p>
            </div>
            
            <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full mt-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90">
                <MousePointerClick className="w-4 h-4 mr-2" />
                Join the AI Exchange Club Newsletter
              </Button>
            </a>

            {/* Social Proof Section */}
            <div className="w-full max-w-md p-4 bg-purple-50 rounded-lg">
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

            <div className="text-sm text-gray-600 max-w-md">
              Join our exclusive AI Exchange Club newsletter and unlock:
              <ul className="mt-2 space-y-1 pl-0">
                <li className="text-left">✨ Early access to marketplace features</li>
                <li className="text-left">💎 Exclusive AI industry insights</li>
                <li className="text-left">🚀 Priority listing opportunities</li>
                <li className="text-left">🤝 Network with fellow AI innovators</li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="w-full max-w-md text-center mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Follow Us</h3>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FF0000] transition-colors"
                >
                  <Youtube className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#1DA1F2] transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#E4405F] transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://aiexchangeclub.beehiiv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#FFA500] transition-colors"
                >
                  <Rss className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
