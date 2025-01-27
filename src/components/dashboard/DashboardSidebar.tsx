import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarMenuGroup } from "./sidebar/SidebarMenuGroup";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { saleModuleItems, generalItems } from "./sidebar/menu-items";

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset" className="border-r border-gray-200">
      <SidebarContent>
        <SidebarLogo />
        <SidebarMenuGroup label="SALE MODULE" items={saleModuleItems} />
        <SidebarMenuGroup label="GENERAL" items={generalItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}