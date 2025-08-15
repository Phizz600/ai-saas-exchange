// import Auth from "@/pages/Auth"; // Deleted - using new AuthPage component
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
import { NewProtectedRoute } from "@/components/auth-v2/NewProtectedRoute";
import { AuthPage } from "@/components/auth-v2/AuthPage";

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
      <NewProtectedRoute requireAuth={false}>
        <AuthPage />
      </NewProtectedRoute>
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
  {
    path: "/diagnostics",
    element: <Diagnostics />,
  },
];

// Protected routes (authentication required)
const protectedRoutes = [
  {
    path: "/marketplace",
    element: (
      <NewProtectedRoute>
        <Marketplace />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/product-dashboard",
    element: (
      <NewProtectedRoute>
        <ProductDashboard />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <NewProtectedRoute>
        <Profile />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/messages",
    element: (
      <NewProtectedRoute>
        <Messages />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/messages/:conversationId",
    element: (
      <NewProtectedRoute>
        <MessageChat />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <NewProtectedRoute>
        <Settings />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/list-product",
    element: (
      <NewProtectedRoute>
        <ListProduct />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <NewProtectedRoute>
        <Admin />
      </NewProtectedRoute>
    ),
  },
  {
    path: "/listing-thank-you",
    element: (
      <NewProtectedRoute>
        <ListingThankYou />
      </NewProtectedRoute>
    ),
  },
];

// Combine all routes
const routes = [...publicRoutes, ...protectedRoutes];

export { routes };
