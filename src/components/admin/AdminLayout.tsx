
import { ChevronRight, LayoutDashboard, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a href="/admin" className="flex items-center space-x-2">
              <span className="font-bold">Admin Dashboard</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Admin sidebar */}
        <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Admin Controls</h2>
              <nav className="space-y-1">
                <a
                  href="/admin"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    window.location.pathname === "/admin" ? "bg-accent" : "transparent"
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
                <a
                  href="/admin/products"
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    window.location.pathname === "/admin/products" ? "bg-accent" : "transparent"
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
        <main className="pl-64 w-full">
          <div className="container py-6 md:py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <a href="/admin" className="hover:text-foreground">
                Admin
              </a>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">Dashboard</span>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
