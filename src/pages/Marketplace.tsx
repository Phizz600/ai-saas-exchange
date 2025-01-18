import { useState } from "react";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { MarketplacePagination } from "@/components/marketplace/MarketplacePagination";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { LiveChatButton } from "@/components/LiveChatButton";
import { Header } from "@/components/Header";

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
  const [sortBy, setSortBy] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sort products based on selected option
  const getSortedProducts = () => {
    let sorted = [...mockProducts];
    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "recent":
        return sorted.sort((a, b) => {
          const getHours = (time: string) => {
            const [days, hours] = time.split(" ");
            return parseInt(days) * 24 + parseInt(hours);
          };
          return getHours(b.timeLeft) - getHours(a.timeLeft);
        });
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-40 px-4 md:px-8">
        <FeaturedCompaniesSlideshow />

        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          stageFilter={stageFilter}
          setStageFilter={setStageFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProductGrid products={currentItems} />

        <MarketplacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        <MarketplaceFAQ />
        <MarketplaceFooter />
        <LiveChatButton />
      </div>
    </div>
  );
}
