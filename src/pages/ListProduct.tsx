import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ListProductForm } from "@/components/marketplace/list-product/ListProductForm";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { HelpDialog } from "@/components/marketplace/list-product/HelpDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const ListProduct = () => {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show a message (ProtectedRoute will handle redirect)
        if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="w-full p-4 bg-amber-900/20 backdrop-blur-md border border-amber-500/20 rounded-md text-amber-200">
              <p className="font-medium">You need to be signed in to list a product</p>
              <Button 
                variant="outline" 
                className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors" 
                onClick={() => window.location.href = "/auth?redirect=/list-product"}
              >
                Sign In / Register
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  console.log('ListProduct page rendered');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 exo-2-heading"
            >
              List Your AI SaaS Product
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              Showcase your AI-powered SaaS to potential investors and buyers. 
              Get your product in front of the right audience.
            </motion.p>
          </div>

          {/* Authentication Status */}
          <div className="mb-6">
            <div className="w-full p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-md">
                <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <p className="text-white/80">Signed in as: {user.email}</p>
              </div>
                </div>
          </div>

          <ListProductForm />
        </motion.div>
      </div>

      {/* Help Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/30 transition-colors border border-white/20 z-20"
        onClick={() => setHelpDialogOpen(true)}
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </motion.button>

      {/* Help Dialog */}
      <HelpDialog 
        open={helpDialogOpen} 
        onOpenChange={setHelpDialogOpen} 
      />
    </div>
  );
};