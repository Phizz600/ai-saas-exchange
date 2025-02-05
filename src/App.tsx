import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Promote } from "@/pages/Promote";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductDashboard />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/promote" element={<AuthGuard><Promote /></AuthGuard>} />
        <Route path="*" element={<ProductDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;