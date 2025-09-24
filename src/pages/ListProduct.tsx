import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle, Crown, ChevronDown } from "lucide-react";
import { HelpDialog } from "@/components/marketplace/list-product/HelpDialog";
import { useAuth } from "@/contexts/CleanAuthContext";
import ExpandableTabs from "@/components/ui/ExpandableTabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const ListProduct = () => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'free-listing' | 'featured-listing' | 'premium-exit' | null>(null);
  const [searchParams] = useSearchParams();
  const {
    user,
    loading
  } = useAuth();
  const {
    toast
  } = useToast();

  // Check for package selection from URL params
  useEffect(() => {
    const packageParam = searchParams.get('package') as 'free-listing' | 'featured-listing' | 'premium-exit';
    if (packageParam && ['free-listing', 'featured-listing', 'premium-exit'].includes(packageParam)) {
      setSelectedPackage(packageParam);

      // Store in localStorage for persistence
      localStorage.setItem('selectedPackage', packageParam);
      const displayName = packageParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      toast({
        title: `${displayName} Package Selected`,
        description: `You've selected the ${displayName.toLowerCase()} package. Complete your listing to proceed.`
      });
    } else {
      // Check localStorage for existing selection
      const storedPackage = localStorage.getItem('selectedPackage') as 'free-listing' | 'featured-listing' | 'premium-exit';
      if (storedPackage && ['free-listing', 'featured-listing', 'premium-exit'].includes(storedPackage)) {
        setSelectedPackage(storedPackage);
      }
    }
  }, [searchParams, toast]);

  // Handle package selection change
  const handlePackageChange = (newPackage: 'free-listing' | 'featured-listing' | 'premium-exit') => {
    setSelectedPackage(newPackage);
    localStorage.setItem('selectedPackage', newPackage);
    const displayName = newPackage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    toast({
      title: `${displayName} Package Selected`,
      description: `You've switched to the ${displayName.toLowerCase()} package.`
    });
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>;
  }

  // If user is not authenticated, show a message (ProtectedRoute will handle redirect)
  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="max-w-4xl mx-auto">
            <div className="w-full p-4 bg-amber-900/20 backdrop-blur-md border border-amber-500/20 rounded-md text-amber-200">
              <p className="font-medium">You need to be signed in to list your AI SaaS business.</p>
              <Button variant="outline" className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors" onClick={() => window.location.href = "/auth?redirect=/list-product"}>
                Sign In / Register
              </Button>
            </div>
          </motion.div>
        </div>
      </div>;
  }
  console.log('ListProduct page rendered');
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="max-w-4xl mx-auto">
          {/* Navigation */}
          <ExpandableTabs />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="text-4xl md:text-5xl font-bold text-white mb-4 exo-2-heading">List Your AI SaaS Business</motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className="text-xl text-white/80 max-w-2xl mx-auto">List your AI SaaS in minutes and get it in front of serious buyers ready to acquire.</motion.p>
          </div>

          {/* Authentication Status */}
          <div className="mb-6">
            <div className="w-full p-3 sm:p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <p className="text-white/80 text-sm truncate">Signed in as: {user.email}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                  <span className="text-white/80 text-sm flex-shrink-0">Package:</span>
                  <Select value={selectedPackage || undefined} onValueChange={handlePackageChange}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a package" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20 z-50">
                      <SelectItem value="free-listing" className="text-white hover:bg-white/10">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          <span>Free Listing</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="featured-listing" className="text-white hover:bg-white/10">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-purple-400" />
                          <span>Featured Listing</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="premium-exit" className="text-white hover:bg-white/10">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-amber-400" />
                          <span>Premium Exit</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <ListProductForm selectedPackage={selectedPackage} />
        </motion.div>
      </div>

      {/* Help Button */}
      <motion.button whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/30 transition-colors border border-white/20 z-20" onClick={() => setHelpDialogOpen(true)}>
        <HelpCircle className="h-6 w-6 text-white" />
      </motion.button>

      {/* Help Dialog */}
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </div>;
};