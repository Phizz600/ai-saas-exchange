
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Timer, Share2, Youtube, Twitter, Facebook, Instagram, Rss } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export const ListingThankYou = () => {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = "I just listed my AI product on AI Exchange Club! Join the waitlist to discover amazing AI products.";
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

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
                Your AI product has been successfully submitted and is now under review for approval.
              </p>
              <p className="text-lg text-gray-700">
                Our marketplace is launching soon, and we'll notify you as soon as we go live!
              </p>
            </div>

            <Separator className="my-6 bg-purple-200" />
            
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
              <p className="text-gray-600 italic">
                Keep an eye on your email for updates about your listing and our launch.
              </p>
            </div>

            <Separator className="my-6 bg-purple-200" />
            
            <a href="https://aiexchangeclub.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full mt-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90">
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

            <Separator className="my-6 bg-purple-200" />

            <div className="text-sm text-gray-600 max-w-md text-center">
              Join our exclusive AI Exchange Club newsletter and unlock:
              <ul className="mt-2 space-y-1">
                <li>✨ Early access to marketplace features</li>
                <li>💎 Exclusive AI industry insights</li>
                <li>🚀 Priority listing opportunities</li>
                <li>🤝 Network with fellow AI innovators</li>
              </ul>
            </div>

            <Separator className="my-6 bg-purple-200" />

            {/* Share Section */}
            <div className="w-full max-w-md text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Share Your Journey</h3>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('twitter')}
                  className="hover:bg-[#1DA1F2] hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('facebook')}
                  className="hover:bg-[#4267B2] hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-[#8B5CF6] hover:text-white transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
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
};
