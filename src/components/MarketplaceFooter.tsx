import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Youtube, Instagram, Rss } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const MarketplaceFooter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    setEmail("");
  };

  const socialLinks = [
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Rss, href: "#", label: "Beehiiv" },
  ];

  return (
    <footer className="w-full bg-accent3 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Join the AI Exchange Club newsletter
            </h3>
            <p className="text-white/80">
              Get weekly insights on AI SaaS acquisitions and industry trends
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center space-x-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} AI Exchange Club. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};