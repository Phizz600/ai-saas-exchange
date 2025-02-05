import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { Dashboard } from "@/pages/Dashboard";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Promote } from "@/pages/Promote"; // Add the new import
import { NotFound } from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/promote" element={<AuthGuard><Promote /></AuthGuard>} /> {/* Add the new route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
