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
  return <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full">
        
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
    </div>;
};