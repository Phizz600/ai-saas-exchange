import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Marketplace } from "@/pages/Marketplace";
import { Auth } from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ListProduct } from "@/pages/ListProduct";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/auth" element={<Auth />} />
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
          path="/product-dashboard" 
          element={
            <AuthGuard>
              <ProductDashboard />
            </AuthGuard>
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;