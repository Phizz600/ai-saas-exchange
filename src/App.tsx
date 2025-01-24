import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import { Marketplace } from "@/pages/Marketplace";
import { ListProduct } from "@/pages/ListProduct";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route
          path="/list-product"
          element={
            <AuthGuard>
              <ListProduct />
            </AuthGuard>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}