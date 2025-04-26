
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
];

export default routes;
