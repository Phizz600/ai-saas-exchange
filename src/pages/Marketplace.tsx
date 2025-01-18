import { useState } from "react";
import { Search } from "lucide-react";
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

// Temporary mock data
const mockProducts = [
  {
    id: 1,
    title: "AI Content Generator",
    description: "Generate high-quality content using advanced AI models",
    price: 25000,
    category: "Content",
    stage: "Revenue",
    monthlyRevenue: 5000,
    image: "https://placehold.co/600x400",
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
  },
  // Add more mock products as needed
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  return (
    <div className="min-h-screen bg-accent pt-24 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-exo">
            AI SaaS Marketplace
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover and invest in the next generation of AI-powered SaaS products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="customer-service">Customer Service</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="revenue">Revenue Generating</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
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