import React from "react";
import { ConfidentialWatermark } from "@/components/marketplace/product-card/ConfidentialWatermark";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function NdaHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <ConfidentialWatermark text="CONFIDENTIAL" opacity={0.15} rotation={30} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl exo-2-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block">Non-Disclosure</span>
            <span className="block text-indigo-600">Agreement Policy</span>
          </motion.h1>
          
          <motion.p 
            className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our NDA policy protects sensitive information when buying or selling AI products. 
            Learn how we safeguard your intellectual property and business details.
          </motion.p>
          
          <motion.div 
            className="mt-10 max-w-sm mx-auto sm:flex sm:justify-center md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="rounded-md shadow">
              <Button asChild className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:opacity-90 transition-opacity md:py-4 md:text-lg md:px-10 relative">
                <Link to="/auth">
                  <Shield className="mr-2 h-5 w-5" />
                  Access Marketplace
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Early Access</span>
                </Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10" asChild>
                <Link to="/terms">
                  <FileText className="mr-2 h-5 w-5" />
                  View Terms
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
