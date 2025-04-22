import { Auth } from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Marketplace } from "@/pages/Marketplace";
import { ProductDetail } from "@/pages/ProductDetail";
import { Messages } from "@/pages/Messages";
import { Help } from "@/pages/Help";
import { Checkout } from "@/pages/Checkout";
import Settings from "@/pages/Settings";

// Add the settings page route
const routes = [
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
    element: <ProductDetail />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
];

export default routes;
