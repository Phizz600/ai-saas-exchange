
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import Index from "@/pages/Index";
import { Marketplace } from "@/pages/Marketplace";
import Auth from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ListProduct } from "@/pages/ListProduct";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { ProductPage } from "@/components/product/ProductPage";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import { ComingSoon } from "@/pages/ComingSoon";
import { ListingThankYou } from "@/pages/ListingThankYou";
import { FeesPricing } from "@/pages/FeesPricing";
import { Policies } from "@/pages/Policies";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import { ResolutionCenter } from "@/pages/ResolutionCenter";
import Messages from "@/pages/Messages";
import { MessageChat } from "@/pages/MessageChat";
import FAQ from "@/pages/FAQ";
import Admin from "@/pages/Admin";
import { ToastProvider } from "@/hooks/use-toast";
import NdaPolicy from "@/pages/NdaPolicy";
import "./App.css";

// Create a client INSIDE the function component to avoid hooks being called outside component context
function App() {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/fees-pricing" element={<FeesPricing />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/nda-policy" element={<NdaPolicy />} />
            <Route path="/resolution-center" element={<ResolutionCenter />} />
            <Route path="/admin" element={<Admin />} />
            <Route 
              path="/profile" 
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } 
            />
            <Route 
              path="/list-product" 
              element={
                <AuthGuard>
                  <ListProduct />
                </AuthGuard>
              } 
            />
            {/* Use the SAME component for all possible URL structures of the thank you page */}
            <Route 
              path="/listing-thank-you" 
              element={
                <AuthGuard>
                  <ListingThankYou />
                </AuthGuard>
              } 
            />
            <Route 
              path="listing-thank-you" 
              element={
                <AuthGuard>
                  <ListingThankYou />
                </AuthGuard>
              } 
            />
            <Route 
              path="/product-dashboard" 
              element={
                <AuthGuard>
                  <ProductDashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <AuthGuard>
                  <Messages />
                </AuthGuard>
              } 
            />
            <Route 
              path="/messages/:conversationId" 
              element={
                <AuthGuard>
                  <MessageChat />
                </AuthGuard>
              } 
            />
            {/* Add a catch-all route for 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-gray-600">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
          <Toaster />
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
