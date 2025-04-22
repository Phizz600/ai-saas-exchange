
import Auth from "@/pages/Auth";
import { Profile } from "@/pages/Profile";
import { ProductDashboard } from "@/pages/ProductDashboard";
import { Marketplace } from "@/pages/Marketplace";
import ProductPage from "@/components/product/ProductPage";
import { Messages } from "@/pages/Messages";
import Settings from "@/pages/Settings";

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
  {
    path: "/settings",
    element: <Settings />,
  },
];

export default routes;
