import { Shield, CheckCircle, Star, User, DollarSign, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
const recentSales = ["AI Chatbot sold for $45,000", "ML Model acquired for $28,000", "NLP Tool purchased for $35,000", "Data Pipeline sold for $52,000", "Image Generation API sold for $67,000", "Voice AI solution acquired for $31,000"];
const testimonials = [{
  text: "Acquired an NLP tool in 48 hours. The escrow process was seamless!",
  author: "Sarah, AI Investor",
  role: "Venture Capital",
  avatar: "/placeholder.svg"
}, {
  text: "The verification process gave me confidence in my purchase.",
  author: "Michael, Tech Entrepreneur",
  role: "Founder",
  avatar: "/placeholder.svg"
}, {
  text: "Smooth transaction from start to finish. Highly recommended!",
  author: "David, ML Engineer",
  role: "CTO",
  avatar: "/placeholder.svg"
}];
export function TrustBoosters() {
  const [currentSaleIndex, setCurrentSaleIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSaleIndex(prev => (prev + 1) % recentSales.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="space-y-10 mb-12">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="exo-2-heading text-2xl md:text-3xl font-bold mb-3 text-gray-900">
          Why Buyers & Sellers <span className="text-[#8B5CF6]">Trust Us</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of AI founders and investors making successful transactions on our marketplace
        </p>
      </div>
    
      {/* Recent Sales Ticker with enhanced styling */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 blur-xl"></div>
        <Card className="bg-white/70 backdrop-blur-md px-6 py-5 border-0 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">Recent Transactions:</span>
            </div>
            <motion.div key={currentSaleIndex} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.5
          }} className="font-medium text-[#8B5CF6]">
              {recentSales[currentSaleIndex]}
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Key Trust Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true,
        margin: "-100px"
      }} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="p-3 bg-green-100 rounded-full w-fit mb-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Escrow Protection</h3>
          <p className="text-gray-600 mb-4">
            All transactions are secured through Escrow.com, ensuring your funds are only released when you're satisfied.
          </p>
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
            100% Secure Transactions
          </Badge>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} viewport={{
        once: true,
        margin: "-100px"
      }} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="p-3 bg-amber-100 rounded-full w-fit mb-4">
            <CheckCircle className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Products</h3>
          <p className="text-gray-600 mb-4">
            Our team thoroughly verifies all products, ensuring accurate descriptions, revenue claims, and technical details.
          </p>
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100">
            Rigorous Verification Process
          </Badge>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.4
      }} viewport={{
        once: true,
        margin: "-100px"
      }} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
          <p className="text-gray-600 mb-4">
            Our team of AI and business experts guide you through the entire process, from listing to acquisition.
          </p>
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
            Dedicated Account Managers
          </Badge>
        </motion.div>
      </div>

      {/* Testimonials with enhanced styling */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-center mb-8">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1,
          duration: 0.5
        }} viewport={{
          once: true,
          margin: "-100px"
        }} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative">
              <div className="absolute -top-4 -right-4">
                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border border-gray-200">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {testimonial.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-700 mb-3">"{testimonial.text}"</p>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
      
      {/* Trust Stats */}
      
    </div>;
}