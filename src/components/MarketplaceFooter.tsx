import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Youtube, Instagram, Rss, Twitter, Linkedin, Github } from "lucide-react";
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
    { icon: Youtube, href: "https://youtube.com/@aiexchangeclub", label: "YouTube" },
    { icon: Instagram, href: "https://instagram.com/aiexchangeclub", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/aiexchangeclub", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/aiexchangeclub", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/aiexchangeclub", label: "GitHub" },
    { icon: Rss, href: "https://aiexchangeclub.beehiiv.com", label: "Newsletter" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Pricing", href: "/pricing" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-accent2 via-accent3 to-accent py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Newsletter Section */}
          <div className="space-y-6 lg:col-span-2">
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
                className="bg-primary hover:bg-primary/90 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-white font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
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