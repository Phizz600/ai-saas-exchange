
import { lazy } from "react";
import { AuthGuard } from "@/components/AuthGuard";

// Main pages
const Index = lazy(() => import("@/pages/Index"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const Auth = lazy(() => import("@/pages/Auth"));
const ProductPage = lazy(() => import("@/components/product/ProductPage").then(module => ({ default: module.ProductPage })));
const ComingSoon = lazy(() => import("@/pages/ComingSoon").then(module => ({ default: module.ComingSoon })));
const FeesPricing = lazy(() => import("@/pages/FeesPricing").then(module => ({ default: module.FeesPricing })));
const Policies = lazy(() => import("@/pages/Policies").then(module => ({ default: module.Policies })));
const Terms = lazy(() => import("@/pages/Terms").then(module => ({ default: module.Terms })));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const NdaPolicy = lazy(() => import("@/pages/NdaPolicy"));
const ResolutionCenter = lazy(() => import("@/pages/ResolutionCenter"));
const Admin = lazy(() => import("@/pages/Admin"));

// Protected pages (require authentication)
const Profile = lazy(() => import("@/pages/Profile").then(module => ({ default: module.Profile })));
const ListProduct = lazy(() => import("@/pages/ListProduct").then(module => ({ default: module.ListProduct })));
const ListingThankYou = lazy(() => import("@/pages/ListingThankYou").then(module => ({ default: module.ListingThankYou })));
const ProductDashboard = lazy(() => import("@/pages/ProductDashboard"));
const Messages = lazy(() => import("@/pages/Messages"));
const MessageChat = lazy(() => import("@/pages/MessageChat"));

// Define route types
export interface AppRoute {
  path: string;
  element: JSX.Element;
  errorElement?: JSX.Element;
}

// Error page for 404 routes
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600">Page not found</p>
    </div>
  </div>
);

// Public routes accessible to all users
export const publicRoutes: AppRoute[] = [
  { path: "/", element: <Index /> },
  { path: "/marketplace", element: <Marketplace /> },
  { path: "/auth", element: <Auth /> },
  { path: "/product/:id", element: <ProductPage /> },
  { path: "/coming-soon", element: <ComingSoon /> },
  { path: "/fees-pricing", element: <FeesPricing /> },
  { path: "/policies", element: <Policies /> },
  { path: "/terms", element: <Terms /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/nda-policy", element: <NdaPolicy /> },
  { path: "/resolution-center", element: <ResolutionCenter /> },
  { path: "/admin", element: <Admin /> },
];

// Protected routes requiring authentication
export const protectedRoutes: AppRoute[] = [
  { path: "/profile", element: <AuthGuard><Profile /></AuthGuard> },
  { path: "/list-product", element: <AuthGuard><ListProduct /></AuthGuard> },
  { path: "/listing-thank-you", element: <AuthGuard><ListingThankYou /></AuthGuard> },
  { path: "/product-dashboard", element: <AuthGuard><ProductDashboard /></AuthGuard> },
  { path: "/messages", element: <AuthGuard><Messages /></AuthGuard> },
  { path: "/messages/:conversationId", element: <AuthGuard><MessageChat /></AuthGuard> },
];

// Catch-all route for 404 handling
export const notFoundRoute: AppRoute = {
  path: "*",
  element: <NotFoundPage />
};

// All routes combined
export const routes: AppRoute[] = [...publicRoutes, ...protectedRoutes, notFoundRoute];
