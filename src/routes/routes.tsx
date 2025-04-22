
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ProductDashboard from "@/pages/ProductDashboard";
import Marketplace from "@/pages/Marketplace";
import ProductPage from "@/components/product/ProductPage";
import Messages from "@/pages/Messages";
// import Help from "@/pages/Help"; // Commented out because file not found
// import Checkout from "@/pages/Checkout"; // Commented out because file not found
import Settings from "@/pages/Settings";

// Fix: Remove broken imports and only set up routes for existing, working pages
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
    element: <ProductPage />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  // {
  //   path: "/help",
  //   element: <Help />,
  // },
  // {
  //   path: "/checkout",
  //   element: <Checkout />,
  // },
  {
    path: "/settings",
    element: <Settings />,
  },
];

export default routes;
