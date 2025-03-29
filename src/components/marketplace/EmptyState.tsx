
import { Search, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function EmptyState() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#D946EE]/20 via-[#8B5CF6]/20 to-[#0EA4E9]/20 animate-pulse blur-xl"></div>
        <div className="bg-white p-6 rounded-full shadow-md border border-gray-100 relative">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
      
      <p className="text-gray-600 max-w-md mb-8">
        We couldn't find any products matching your current filters. Try adjusting your search criteria or check back later.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          variant="outline" 
          className="bg-white shadow-sm hover:shadow-md"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Button 
          className="bg-gradient-to-r from-[#D946EE] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90"
        >
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </motion.div>
  );
}
