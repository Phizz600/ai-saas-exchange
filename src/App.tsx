import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import { AuthGuard } from "./components/AuthGuard";
import { MarketplaceLayout } from "./layouts/MarketplaceLayout";
import { ProductPage } from "./components/product/ProductPage";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import ProductDashboard from "./pages/ProductDashboard";
import Products from "./pages/Products";
import Promote from "./pages/Promote";
import { AdminDashboard } from "./pages/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/marketplace",
    element: (
      <AuthGuard>
        <MarketplaceLayout>
          <Marketplace />
        </MarketplaceLayout>
      </AuthGuard>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: (
      <AuthGuard>
        <Profile />
      </AuthGuard>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <AdminDashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/product/:id",
    element: (
      <AuthGuard>
        <ProductPage />
      </AuthGuard>
    ),
  },
  {
    path: "/help",
    element: (
      <AuthGuard>
        <Help />
      </AuthGuard>
    ),
  },
  {
    path: "/settings",
    element: (
      <AuthGuard>
        <Settings />
      </AuthGuard>
    ),
  },
  {
    path: "/product-dashboard",
    element: (
      <AuthGuard>
        <ProductDashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/products",
    element: (
      <AuthGuard>
        <Products />
      </AuthGuard>
    ),
  },
  {
    path: "/promote",
    element: (
      <AuthGuard>
        <Promote />
      </AuthGuard>
    ),
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
