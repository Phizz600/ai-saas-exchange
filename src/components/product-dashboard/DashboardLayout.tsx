import { useState } from "react";
import { Header } from "@/components/Header";
import { NotificationSheet } from "../marketplace/notifications/NotificationSheet";
import { useNotifications } from "../marketplace/notifications/useNotifications";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Dashboard</h1>
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
  );
};