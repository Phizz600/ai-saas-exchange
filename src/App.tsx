import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { Marketplace } from "@/pages/Marketplace";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;