import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon."
      });

      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9]">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8">
          <h1 className="exo-2-heading text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#D946EE] to-[#0EA4E9] bg-clip-text text-transparent">
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
                  <Mail className="h-6 w-6 text-[#8B5CF6] mt-1" />
                  <div>
                    <h3 className="font-semibold text-left">Email</h3>
                    <p className="text-gray-600">support@aiexchangeclub.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-[#8B5CF6] mt-1" />
                  <div>
                    <h3 className="font-semibold text-left">Phone</h3>
                    <p className="text-gray-600">+1 (507) 301-6119</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-[#8B5CF6] mt-1" />
                  <div>
                    <h3 className="font-semibold text-left">Office</h3>
                    <p className="text-gray-600">
                      123 AI Boulevard<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-center">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9am to 5pm PST<br />
                  Saturday & Sunday: Closed
                </p>
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
                
                <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] text-white">
                  {isSubmitting ? <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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
    </div>;
};
export default Contact;