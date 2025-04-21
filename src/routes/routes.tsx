
import Auth from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Marketplace } from "@/pages/Marketplace";
import { Messages } from "@/pages/Messages";
import Settings from "@/pages/Settings";
import { AuthGuard } from "@/components/AuthGuard";
import { Index } from "@/pages/Index";  // Import the Index component

const routes = [
  {
    path: "/",  // Add the root path
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
];

export default routes;
