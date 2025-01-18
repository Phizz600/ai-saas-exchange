import { useState } from "react";
import { Search, Plus, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

// Updated mock data
const mockProducts = [
  {
    id: 1,
    title: "AI Content Generator",
    description: "Generate high-quality content using advanced AI models",
    price: 25000,
    category: "Content Generation",
    stage: "Revenue",
    monthlyRevenue: 5000,
    image: "https://placehold.co/600x400",
    timeLeft: "2d 5h",
    seller: {
      id: 1,
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      achievements: [
        { type: "TopBidder", label: "Top Bidder" },
        { type: "DealmakerOfMonth", label: "Dealmaker of the Month" }
      ]
    }
  },
  {
    id: 2,
    title: "ChatBot Builder",
    description: "Create custom chatbots for customer service",
    price: 15000,
    category: "Customer Service",
    stage: "MVP",
    monthlyRevenue: 0,
    image: "https://placehold.co/600x400",
    timeLeft: "5d 12h",
    seller: {
      id: 2,
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      achievements: [
        { type: "FirstTimeBuyer", label: "First-Time Buyer" },
        { type: "SuccessfulAcquisition", label: "Successful Acquisition" }
      ]
    }
  },
];

const industries = [
  "AI/ML",
  "Analytics",
  "Content Generation",
  "Customer Service",
  "Data Processing",
  "E-commerce",
  "Education",
  "Enterprise",
  "Finance",
  "Healthcare",
  "HR/Recruiting",
  "Marketing",
  "Productivity",
  "Sales",
  "Security",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "IoT",
  "Blockchain",
  "DevOps",
  "Business Intelligence",
  "API Services",
  "Cloud Computing",
  "Cybersecurity",
];

const stages = [
  "Pre-Revenue",
  "MVP",
  "Revenue < $1k/mo",
  "Revenue $1k-$5k/mo",
  "Revenue $5k-$20k/mo",
  "Revenue > $20k/mo",
];

const priceRanges = [
  "Under $10k",
  "$10k - $50k",
  "$50k - $100k",
  "$100k - $500k",
  "$500k+",
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  return (
    <div className="min-h-screen bg-white pt-24 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header with List Product Button */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col items-center">
            <span className="font-exo text-3xl font-semibold bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA5E9] text-transparent bg-clip-text">
              AI Exchange Club
            </span>
          </div>
          <Button 
            className="bg-[#0EA4E9] hover:bg-[#0EA4E9]/90 text-white font-semibold"
            onClick={() => console.log("List Product clicked")}
          >
            <Plus className="mr-2" />
            List Your AI SaaS
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="bg-[#f3f3f3]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="bg-[#f3f3f3]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage.toLowerCase()}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="bg-[#f3f3f3]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Prices</SelectItem>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range.toLowerCase()}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="bg-[#f3f3f3]">
                <SelectValue placeholder="Time Left" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">All Auctions</SelectItem>
                <SelectItem value="ending-soon">Ending Soon (24h)</SelectItem>
                <SelectItem value="1-3-days">1-3 Days</SelectItem>
                <SelectItem value="3-7-days">3-7 Days</SelectItem>
                <SelectItem value="7-plus-days">7+ Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
