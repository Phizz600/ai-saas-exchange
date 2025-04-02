
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "./App.css";

function App() {
  return (
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
          <Route 
            path="/listing-thank-you" 
            element={
              <AuthGuard>
                <ListingThankYou />
              </AuthGuard>
            } 
          />
          {/* Make sure we also support the URL structure shown in the error */}
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
  );
}

export default App;
