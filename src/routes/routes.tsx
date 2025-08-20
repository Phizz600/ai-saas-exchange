// import Auth from "@/pages/Auth"; // Deleted - using new AuthPage component
import { Profile } from "@/pages/Profile";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { BrowseMarketplace } from "@/pages/BrowseMarketplace";
import { SellersPage } from "@/pages/SellersPage";
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
import { OnboardingRedirect } from "@/pages/OnboardingRedirect";
import { CleanProtectedRoute } from "@/components/auth-clean/CleanProtectedRoute";
import { CleanAuthPage } from "@/components/auth-clean/CleanAuthPage";
import { Marketplace } from "@/pages/Marketplace";
import PrivatePartnersProgram from "@/pages/PrivatePartnersProgram";

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
      <CleanProtectedRoute requireAuth={false}>
        <CleanAuthPage />
      </CleanProtectedRoute>
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
  {
    path: "/private-partners-program",
    element: <PrivatePartnersProgram />,
  },
];

// Protected routes (authentication required)
const protectedRoutes = [
  {
    path: "/onboarding-redirect",
    element: (
      <CleanProtectedRoute>
        <OnboardingRedirect />
      </CleanProtectedRoute>
    ),
  },
  // Browse marketplace route temporarily disabled
  // {
  //   path: "/browse-marketplace",
  //   element: (
  //     <CleanProtectedRoute>
  //       <BrowseMarketplace />
  //     </CleanProtectedRoute>
  //   ),
  // },
  {
    path: "/product-dashboard", 
    element: (
      <CleanProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold mb-4 exo-2-heading">Dashboard Coming Soon</h1>
          <p className="text-gray-600 mb-6">We're working hard to bring you an amazing dashboard experience. Stay tuned!</p>
          {/* Browse Marketplace button temporarily hidden */}
          {/* <button 
            onClick={() => window.location.href = '/browse'} 
            className="px-6 py-3 bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse Marketplace
          </button> */}
        </div>
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <CleanProtectedRoute>
        <Profile />
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/messages",
    element: (
      <CleanProtectedRoute>
        <Messages />
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/messages/:conversationId",
    element: (
      <CleanProtectedRoute>
        <MessageChat />
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <CleanProtectedRoute>
        <Settings />
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/list-product",
    element: (
      <CleanProtectedRoute>
        <SellersPage />
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <CleanProtectedRoute>
        <Admin />
      </CleanProtectedRoute>
    ),
  },
  {
    path: "/listing-thank-you",
    element: (
      <CleanProtectedRoute>
        <ListingThankYou />
      </CleanProtectedRoute>
    ),
  },
];

// Combine all routes
const routes = [...publicRoutes, ...protectedRoutes];

export { routes };
