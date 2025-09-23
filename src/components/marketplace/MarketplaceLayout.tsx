import { Header } from "@/components/Header";
import { FeaturedCompaniesSlideshow } from "@/components/FeaturedCompaniesSlideshow";
import { MarketplaceContent } from "@/components/marketplace/MarketplaceContent";
import { MarketplaceFAQ } from "@/components/MarketplaceFAQ";
import { MarketplaceFooter } from "@/components/MarketplaceFooter";
import { LiveChatButton } from "@/components/LiveChatButton";
import { MarketplaceBreadcrumb } from "@/components/marketplace/MarketplaceBreadcrumb";
import { TrustBoosters } from "@/components/marketplace/trust/TrustBoosters";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Shield, CheckCircle, Search, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export const MarketplaceLayout = () => {
  useEffect(() => {
    console.log('MarketplaceLayout mounted');
    console.log('Checking component imports:', {
      Header: !!Header,
      FeaturedCompaniesSlideshow: !!FeaturedCompaniesSlideshow,
      MarketplaceContent: !!MarketplaceContent,
      MarketplaceFAQ: !!MarketplaceFAQ,
      MarketplaceFooter: !!MarketplaceFooter
    });
  }, []);
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow w-full mt-16">
        {/* Hero Section with Background Gradient */}
        <div className="relative bg-gradient-to-r from-[#D946EE]/10 via-[#8B5CF6]/10 to-[#0EA4E9]/10 py-12 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#D946EE]/20 rounded-full filter blur-3xl animate-float" />
            <div className="absolute top-20 right-20 w-60 h-60 bg-[#8B5CF6]/20 rounded-full filter blur-3xl animate-float" style={{
            animationDelay: '2s'
          }} />
            <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-[#0EA4E9]/20 rounded-full filter blur-3xl animate-float" style={{
            animationDelay: '4s'
          }} />
          </div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <MarketplaceBreadcrumb />
            <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8" initial="hidden" animate="visible" variants={fadeIn}>
              <div className="space-y-3">
                <h1 className="exo-2-heading text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] inline-block text-transparent bg-clip-text">
                  AI Products Marketplace
                </h1>
                <p className="text-lg text-gray-600 max-w-xl">Welcome! You're now logged in and can browse, bid, and buy verified AI SaaS businesses</p>
              </div>
              <div className="flex gap-2">
                <Link to="/product-dashboard" className="hidden sm:block">
                  <Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/list-product">
                  <Button className="hidden sm:flex bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:shadow-lg transition-all hover:opacity-90 border-0">
                    <Plus className="mr-2 h-4 w-4" />
                    List Your Product
                  </Button>
                  <Button className="sm:hidden bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:shadow-lg transition-all hover:opacity-90 border-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="max-w-none space-y-12">
            {/* Companies Slideshow with improved appearance */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <FeaturedCompaniesSlideshow />
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-[#D946EE]/10">
                    <Shield className="h-5 w-5 text-[#D946EE]" />
                  </div>
                  <h3 className="font-semibold text-lg">Escrow Protected</h3>
                </div>
                <p className="mt-3 text-gray-600 pl-11">
                  Your payment is held securely until the transfer is complete
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-[#8B5CF6]/10">
                    <CheckCircle className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <h3 className="font-semibold text-lg">100% Verified Listings</h3>
                </div>
                <p className="mt-3 text-gray-600 pl-11">
                  Every product undergoes thorough verification before listing
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-[#0EA4E9]/10">
                    <Clock className="h-5 w-5 text-[#0EA4E9]" />
                  </div>
                  <h3 className="font-semibold text-lg">Fixed Price Marketplace</h3>
                </div>
                <p className="mt-3 text-gray-600 pl-11">
                  Purchase AI tools and platforms at transparent fixed prices
                </p>
              </div>
            </motion.div>
            
            {/* Stats Counter */}
            
            
            {/* Main Content */}
            <MarketplaceContent />
            
            {/* Trust Boosters Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.5
          }}>
              <TrustBoosters />
            </motion.div>
            
            {/* FAQ Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.6
          }}>
              <MarketplaceFAQ />
            </motion.div>
          </div>
        </div>
      </main>
      <MarketplaceFooter />
      <LiveChatButton />
    </div>;
};