import { useState } from "react";
import { Header } from "@/components/Header";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { NotificationSheet } from "../marketplace/notifications/NotificationSheet";
import { useNotifications } from "../marketplace/notifications/useNotifications";
import { Badge } from "../ui/badge";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Product Dashboard</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </div>
            </div>

            {children}

            <NotificationSheet
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              open={isNotificationsOpen}
              onOpenChange={setIsNotificationsOpen}
            />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};