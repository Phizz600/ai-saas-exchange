
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { ParticlesBackground } from "@/components/hero/ParticlesBackground";
import { sendContactEmail } from "@/integrations/supabase/contact";

export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!name || !email || !subject || !message) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields to send your message.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Send the contact email
      const result = await sendContactEmail(name, email, subject, message);

      if (result.success) {
        toast({
          title: "Message sent",
          description: "We've received your message and will get back to you soon."
        });

        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error(result.error || "Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <h1 className="exo-2-heading text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#13293D] to-[#0EA4E9] bg-clip-text text-slate-950">
              Contact Us
            </h1>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about buying or selling AI businesses? Our team is here to help you navigate the process and find the perfect match for your needs.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-[#0EA4E9] mt-1" />
                    <div>
                      <h3 className="font-semibold text-left">Email</h3>
                      <p className="text-gray-600">support@aiexchange.club</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-[#0EA4E9] mt-1" />
                    <div>
                      <h3 className="font-semibold text-left">Phone</h3>
                      <p className="text-gray-600">+1 (507) 301-6119</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" className="w-full" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" className="w-full" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input id="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="How can we help?" className="w-full" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Tell us how we can assist you..." className="w-full min-h-[120px]" />
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#13293D] via-[#16324F] to-[#0EA4E9] text-white">
                    {isSubmitting ? <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Sending...
                      </span> : <span className="flex items-center justify-center">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </span>}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>;
};
export default Contact;
