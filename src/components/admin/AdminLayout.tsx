
import { ChevronRight, LayoutDashboard, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      {/* Admin header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Admin sidebar */}
        <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 bg-white border-r shadow-sm">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-4 px-4 text-sm font-semibold text-gray-500 uppercase">
                Admin Controls
              </h2>
              <nav className="space-y-1">
                <a
                  href="/admin"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    window.location.pathname === "/admin" 
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
                <a
                  href="/admin/products"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    window.location.pathname === "/admin/products"
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="pl-64 w-full bg-[#F1F0FB]">
          <div className="container py-6 md:py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <a href="/admin" className="hover:text-gray-700">
                Admin
              </a>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-gray-700 font-medium">Dashboard</span>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
