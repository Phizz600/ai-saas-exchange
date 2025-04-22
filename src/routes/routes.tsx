
import Auth from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Marketplace } from "@/pages/Marketplace";
import { Messages } from "@/pages/Messages";
import Settings from "@/pages/Settings";
import { AuthGuard } from "@/components/AuthGuard";
import { Index } from "@/pages/Index";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { ComingSoon } from "@/pages/ComingSoon";
import { ListProduct } from "@/pages/ListProduct";
import { Policies } from "@/pages/Policies";
import { Terms } from "@/pages/Terms";
import { NdaPolicy } from "@/pages/NdaPolicy";
import { FeesPricing } from "@/pages/FeesPricing";
import { FAQ } from "@/pages/FAQ";

const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <AuthGuard><Profile /></AuthGuard>,
  },
  {
    path: "/product-dashboard",
    element: <AuthGuard><ProductDashboard /></AuthGuard>,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/messages",
    element: <AuthGuard><Messages /></AuthGuard>,
  },
  {
    path: "/settings",
    element: <AuthGuard><Settings /></AuthGuard>,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/coming-soon",
    element: <ComingSoon />,
  },
  {
    path: "/list-product",
    element: <ListProduct />,
  },
  {
    path: "/policies",
    element: <Policies />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/nda-policy",
    element: <NdaPolicy />,
  },
  {
    path: "/fees-pricing",
    element: <FeesPricing />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  // Catch-all 404 route
  {
    path: "*",
    element: <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
      </div>
    </div>,
  },
];

export default routes;
