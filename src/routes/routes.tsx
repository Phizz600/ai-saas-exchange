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
import { AuthTest } from "@/pages/AuthTest";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public routes (no authentication required)
const publicRoutes = [
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
    element: (
      <ProtectedRoute requireAuth={false}>
        <Auth />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product/:productId",
    element: <ProductPage />,
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
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/fees-pricing",
    element: <FeesPricing />,
  },
  {
    path: "/auth-test",
    element: <AuthTest />,
  },
];

// Protected routes (authentication required)
const protectedRoutes = [
  {
    path: "/marketplace",
    element: (
      <ProtectedRoute>
        <Marketplace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product-dashboard",
    element: (
      <ProtectedRoute>
        <ProductDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    ),
  },
  {
    path: "/messages/:conversationId",
    element: (
      <ProtectedRoute>
        <MessageChat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/list-product",
    element: (
      <ProtectedRoute>
        <ListProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/listing-thank-you",
    element: (
      <ProtectedRoute>
        <ListingThankYou />
      </ProtectedRoute>
    ),
  },
  {
    path: "/diagnostics",
    element: (
      <ProtectedRoute>
        <Diagnostics />
      </ProtectedRoute>
    ),
  },
];

// Combine all routes
const routes = [...publicRoutes, ...protectedRoutes];

export default routes;
