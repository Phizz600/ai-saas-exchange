import {
  BarChart2,
  ShoppingBag,
  TrendingUp,
  Megaphone,
  Store,
  Lightbulb,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@supabase/auth-helpers-react";

const saleModuleItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    path: "/product-dashboard",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    path: "/products",
  },
  {
    title: "Traffics",
    icon: TrendingUp,
    path: "/traffics",
  },
  {
    title: "Marketing Tools",
    icon: Megaphone,
    path: "/marketing",
  },
  {
    title: "Store Info",
    icon: Store,
    path: "/store",
  },
  {
    title: "Promote your shop",
    icon: Lightbulb,
    path: "/promote",
  },
];

const generalItems = [
  {
    title: "Help",
    icon: HelpCircle,
    path: "/help",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function DashboardSidebar() {
  const auth = useAuth();
  const user = auth?.user;

  return (
    <Sidebar variant="inset" className="border-r border-gray-200">
      <SidebarContent>
        <div className="mb-4 px-2">
          <img 
            src="/ai-exchange-logo.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 font-normal">
            SALE MODULE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {saleModuleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="hover:bg-purple-50 text-gray-600 hover:text-purple-600"
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-gray-400" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 font-normal">
            GENERAL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="hover:bg-purple-50 text-gray-600 hover:text-purple-600"
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-gray-400" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-purple-500">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={() => auth?.signOut()} 
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}