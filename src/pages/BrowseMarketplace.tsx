import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Search, Filter, Verified, DollarSign, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data structure - in real implementation, this would come from Airtable API
interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  revenue: string;
  category: string;
  verified: boolean;
  daysListed: number;
  views: number;
  image: string;
}

const mockListings: MarketplaceItem[] = [
  {
    id: '1',
    title: 'AI Content Generator SaaS',
    description: 'Automated content creation tool with 500+ active subscribers',
    price: '$250,000',
    revenue: '$15k/mo',
    category: 'Content',
    verified: true,
    daysListed: 5,
    views: 234,
    image: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Customer Support AI Bot',
    description: 'Intelligent chatbot solution for e-commerce businesses',
    price: '$180,000',
    revenue: '$12k/mo',
    category: 'Customer Service',
    verified: true,
    daysListed: 12,
    views: 189,
    image: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'AI Analytics Dashboard',
    description: 'Real-time data analytics platform with predictive insights',
    price: '$320,000',
    revenue: '$22k/mo',
    category: 'Analytics',
    verified: false,
    daysListed: 3,
    views: 156,
    image: '/placeholder.svg'
  }
];

export const BrowseMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [filteredListings, setFilteredListings] = useState(mockListings);

  const categories = ['all', 'Content', 'Customer Service', 'Analytics', 'Marketing', 'Sales'];

  useEffect(() => {
    let filtered = mockListings;

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (showVerifiedOnly) {
      filtered = filtered.filter(item => item.verified);
    }

    setFilteredListings(filtered);
  }, [searchQuery, selectedCategory, showVerifiedOnly]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-exo">
            Browse AI SaaS Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover verified AI SaaS businesses ready for acquisition. 
            Find your next investment opportunity.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            <Button
              variant={showVerifiedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className="flex items-center gap-2"
            >
              <Verified className="h-4 w-4" />
              Verified Only
            </Button>
          </div>
        </motion.div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl">
                    {listing.title.charAt(0)}
                  </div>
                  <p className="text-sm text-gray-600">AI SaaS Business</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {listing.title}
                  </h3>
                  {listing.verified && (
                    <Badge className="bg-green-100 text-green-800 ml-2">
                      <Verified className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {listing.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Price:
                    </span>
                    <span className="font-semibold text-gray-900">{listing.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Monthly Revenue:</span>
                    <span className="font-semibold text-green-600">{listing.revenue}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Listed {listing.daysListed} days ago
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {listing.views} views
                  </span>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mt-16 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Make an Offer?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join our platform to access detailed financials and connect directly with sellers.
          </p>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-8">
            Get Started as a Buyer
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseMarketplace;