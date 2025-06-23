
import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Marketplace } from "@/pages/Marketplace";
import { Auth } from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ProductPage } from "@/pages/ProductPage";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Messages } from "@/pages/Messages";
import { MessageChat } from "@/pages/MessageChat";
import { ListProduct } from "@/pages/ListProduct";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Settings } from "@/pages/Settings";
import { Admin } from "@/pages/Admin";
import { Terms } from "@/pages/Terms";
import { Policies } from "@/pages/Policies";
import { NdaPolicy } from "@/pages/NdaPolicy";
import { FeesPricing } from "@/pages/FeesPricing";
import { AISaasQuiz } from "@/pages/AISaasQuiz";
import { BuyerMatchingQuiz } from "@/pages/BuyerMatchingQuiz";
import { FAQ } from "@/pages/FAQ";
import { ResolutionCenter } from "@/pages/ResolutionCenter";
import { ListingThankYou } from "@/pages/ListingThankYou";
import { ComingSoon } from "@/pages/ComingSoon";
import { Diagnostics } from "@/pages/Diagnostics";

export const RouteProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:conversationId" element={<MessageChat />} />
      <Route path="/list-product" element={<ListProduct />} />
      <Route path="/dashboard" element={<ProductDashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/nda-policy" element={<NdaPolicy />} />
      <Route path="/fees-pricing" element={<FeesPricing />} />
      <Route path="/ai-saas-quiz" element={<AISaasQuiz />} />
      <Route path="/ai-saas-quiz/submit" element={<AISaasQuiz />} />
      <Route path="/buyer-matching-quiz" element={<BuyerMatchingQuiz />} />
      <Route path="/buyer-matching-quiz/submit" element={<BuyerMatchingQuiz />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/resolution-center" element={<ResolutionCenter />} />
      <Route path="/listing-thank-you" element={<ListingThankYou />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/diagnostics" element={<Diagnostics />} />
    </Routes>
  );
};
