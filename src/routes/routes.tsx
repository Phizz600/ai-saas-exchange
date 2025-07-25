
import Auth from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Marketplace } from "@/pages/Marketplace";
import ProductPage from "@/pages/ProductPage";
import { Messages } from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Index from "@/pages/Index";
import { Admin } from "@/pages/Admin";
import { ListProduct } from "@/pages/ListProduct";
import { NdaPolicy } from "@/pages/NdaPolicy";
import { FAQ } from "@/pages/FAQ";
import { About } from "@/pages/About";
import { Terms } from "@/pages/Terms";
import { Policies } from "@/pages/Policies";
import { MessageChat } from "@/pages/MessageChat";
import Diagnostics from "@/pages/Diagnostics";
import { ListingThankYou } from "@/pages/ListingThankYou";
import { Contact } from "@/pages/Contact";
import { AISaasQuiz } from "@/pages/AISaasQuiz";
import { FeesPricing } from "@/pages/FeesPricing";
import { BuyerMatchingQuiz } from "@/pages/BuyerMatchingQuiz";

const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/ai-saas-quiz",
    element: <AISaasQuiz />,
  },
  {
    path: "/ai-saas-quiz/submit",
    element: <AISaasQuiz />,
  },
  {
    path: "/buyer-matching-quiz",
    element: <BuyerMatchingQuiz />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/product-dashboard",
    element: <ProductDashboard />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/product/:productId",
    element: <ProductPage />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/messages/:conversationId",
    element: <MessageChat />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/list-product",
    element: <ListProduct />,
  },
  {
    path: "/listing-thank-you",
    element: <ListingThankYou />,
  },
  {
    path: "/nda-policy",
    element: <NdaPolicy />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/policies",
    element: <Policies />,
  },
  {
    path: "/diagnostics",
    element: <Diagnostics />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/fees-pricing",
    element: <FeesPricing />,
  },
];

export default routes;
