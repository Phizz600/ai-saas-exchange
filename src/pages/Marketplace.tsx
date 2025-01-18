import { useState } from "react";
import { Search, Plus } from "lucide-react";
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
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { LiveChatButton } from "@/components/LiveChatButton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const industries = [
  "Content Generation",
  "Customer Service",
  "Image Generation",
  "Development Tools",
  "Audio Processing",
  "Finance",
  "Video Processing"
];

const stages = [
  "MVP",
  "Revenue",
  "Pre-Revenue",
  "Beta"
];

const priceRanges = [
  "$0 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+"
];

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
        { type: "TopBidder" as const, label: "Top Bidder" },
        { type: "DealmakerOfMonth" as const, label: "Dealmaker of the Month" }
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
        { type: "FirstTimeBuyer" as const, label: "First-Time Buyer" },
        { type: "SuccessfulAcquisition" as const, label: "Successful Acquisition" }
      ]
    }
  },
  {
    id: 3,
    title: "AI Image Generator",
    description: "Create stunning images using state-of-the-art AI models",
    price: 35000,
    category: "Image Generation",
    stage: "Revenue",
    monthlyRevenue: 7500,
    image: "https://placehold.co/600x400",
    timeLeft: "3d 8h",
    seller: {
      id: 3,
      name: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      achievements: [
        { type: "TopBidder" as const, label: "Top Bidder" },
        { type: "SuccessfulAcquisition" as const, label: "Successful Acquisition" }
      ]
    }
  },
  {
    id: 4,
    title: "AI Code Assistant",
    description: "Intelligent code completion and suggestions powered by AI",
    price: 45000,
    category: "Development Tools",
    stage: "Revenue",
    monthlyRevenue: 9000,
    image: "https://placehold.co/600x400",
    timeLeft: "4d 15h",
    seller: {
      id: 4,
      name: "Michael Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      achievements: [
        { type: "DealmakerOfMonth" as const, label: "Dealmaker of the Month" }
      ]
    }
  },
  {
    id: 5,
    title: "AI Voice Synthesis",
    description: "Generate natural-sounding voices for various applications",
    price: 28000,
    category: "Audio Processing",
    stage: "MVP",
    monthlyRevenue: 0,
    image: "https://placehold.co/600x400",
    timeLeft: "6d 12h",
    seller: {
      id: 5,
      name: "Emily Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      achievements: [
        { type: "FirstTimeBuyer" as const, label: "First-Time Buyer" }
      ]
    }
  },
  {
    id: 6,
    title: "AI Market Analyzer",
    description: "Advanced market analysis and prediction platform",
    price: 55000,
    category: "Finance",
    stage: "Revenue",
    monthlyRevenue: 12000,
    image: "https://placehold.co/600x400",
    timeLeft: "2d 18h",
    seller: {
      id: 6,
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      achievements: [
        { type: "TopBidder" as const, label: "Top Bidder" },
        { type: "DealmakerOfMonth" as const, label: "Dealmaker of the Month" }
      ]
    }
  },
  {
    id: 7,
    title: "AI Video Editor",
    description: "Automated video editing and enhancement suite",
    price: 42000,
    category: "Video Processing",
    stage: "Revenue",
    monthlyRevenue: 8500,
    image: "https://placehold.co/600x400",
    timeLeft: "5d 9h",
    seller: {
      id: 7,
      name: "Rachel Green",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
      achievements: [
        { type: "SuccessfulAcquisition" as const, label: "Successful Acquisition" }
      ]
    }
  }
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white pt-24 px-4 md:px-8">
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
          Sell Your AI SaaS
        </Button>
      </div>
      
      <FeaturedCompaniesSlideshow />

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mb-12">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <MarketplaceFAQ />
      <MarketplaceFooter />
      <LiveChatButton />
    </div>
  );
}
